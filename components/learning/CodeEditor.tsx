'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Play, Lightbulb } from 'lucide-react';

interface TestCaseResult {
  description: string;
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
}

interface CodeEditorProps {
  lessonId: string;
  exerciseId: string;
  phase: number;
  starterCode: string;
  onSuccess?: () => void;
}

export function CodeEditor({
  lessonId,
  exerciseId,
  phase,
  starterCode,
  onSuccess,
}: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [hints, setHints] = useState<{ level: number; content: string }[]>([]);
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  const runCode = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const response = await fetch('/api/code-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
          code,
          lessonId,
          exerciseId,
          phase,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to evaluate code');
      }

      setResult(data);

      if (data.passed && onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setResult({
        passed: false,
        error: error.message,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const requestHint = async () => {
    const nextLevel = currentHintLevel + 1;

    if (nextLevel > 3) {
      return; // Max 3 hints
    }

    setIsLoadingHint(true);

    try {
      const response = await fetch('/api/hints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({
          lessonId,
          exerciseId,
          phase,
          level: nextLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get hint');
      }

      setHints([...hints, { level: data.level, content: data.hint }]);
      setCurrentHintLevel(nextLevel);
    } catch (error: any) {
      console.error('Failed to load hint:', error);
    } finally {
      setIsLoadingHint(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Code Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Code</CardTitle>
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results and Hints */}
      <div className="space-y-6">
        {/* Hints Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Hints
              </CardTitle>
              <Button
                variant="outline"
                onClick={requestHint}
                disabled={isLoadingHint || currentHintLevel >= 3}
                size="sm"
              >
                {isLoadingHint
                  ? 'Loading...'
                  : currentHintLevel >= 3
                  ? 'All Hints Used'
                  : `Get Hint ${currentHintLevel + 1}/3`}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {hints.length === 0 ? (
              <p className="text-sm text-gray-600">
                Stuck? Click "Get Hint" for progressive hints to help you solve this exercise.
              </p>
            ) : (
              <div className="space-y-3">
                {hints.map((hint) => (
                  <Alert key={hint.level} className="bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="mt-0.5">
                        Hint {hint.level}
                      </Badge>
                      <p className="text-sm flex-1">{hint.content}</p>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Test Results
                {result.passed ? (
                  <Badge className="bg-green-500">All Tests Passed! ✓</Badge>
                ) : (
                  <Badge variant="destructive">
                    {result.passedTests || 0} / {result.totalTests || 0} Passed
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.error ? (
                <Alert variant="destructive">
                  <p className="font-semibold">Error:</p>
                  <p className="text-sm mt-1">{result.error}</p>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {result.testResults?.map((test: TestCaseResult, index: number) => (
                    <Alert
                      key={index}
                      className={
                        test.passed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }
                    >
                      <div className="flex items-start gap-2">
                        <Badge
                          variant={test.passed ? 'default' : 'destructive'}
                          className="mt-0.5"
                        >
                          {test.passed ? '✓' : '✗'}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{test.description}</p>
                          <div className="mt-2 text-sm space-y-1">
                            <p>
                              <span className="font-medium">Input:</span>{' '}
                              {JSON.stringify(test.input)}
                            </p>
                            <p>
                              <span className="font-medium">Expected:</span>{' '}
                              {JSON.stringify(test.expected)}
                            </p>
                            <p>
                              <span className="font-medium">Got:</span>{' '}
                              {JSON.stringify(test.actual)}
                            </p>
                            {test.error && (
                              <p className="text-red-600">
                                <span className="font-medium">Error:</span> {test.error}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}

                  {result.executionTimeMs && (
                    <p className="text-xs text-gray-600 text-right">
                      Execution time: {result.executionTimeMs}ms
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
