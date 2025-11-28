'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Play, Lightbulb } from 'lucide-react';
import { useActivityTracking } from '@/hooks/useActivityTracking';

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
  const [isLoadingSolution, setIsLoadingSolution] = useState(true);
  const [lessonStatus, setLessonStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started');

  // Track time spent on this lesson
  useActivityTracking(lessonId, phase);

  // Load saved solution and lesson status when component mounts or lesson changes
  useEffect(() => {
    const loadSavedSolution = async () => {
      setIsLoadingSolution(true);
      try {
        const response = await fetch(
          `/api/submissions?lessonId=${lessonId}`,
          {
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.code) {
            setCode(data.code);
          } else {
            setCode(starterCode);
          }
          // Set lesson status if available
          if (data.status) {
            setLessonStatus(data.status);
          }
        } else {
          setCode(starterCode);
        }
      } catch (error) {
        console.error('Failed to load saved solution:', error);
        setCode(starterCode);
      } finally {
        setIsLoadingSolution(false);
      }
    };

    loadSavedSolution();
  }, [lessonId, starterCode]);

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
            {isLoadingSolution ? (
              <div className="h-[400px] flex items-center justify-center bg-[#1e1e1e] text-gray-400">
                Loading your saved solution...
              </div>
            ) : (
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results and Hints */}
      <div className="space-y-6 flex flex-col justify-between">
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

        {/* Results Section - Always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Test Results
              {result ? (
                result.passed ? (
                  <Badge className="bg-chart-1">All Tests Passed! ✓</Badge>
                ) : (
                  <Badge variant="destructive">
                    {result.passedTests || 0} / {result.totalTests || 0} Passed
                  </Badge>
                )
              ) : lessonStatus === 'completed' ? (
                <Badge className="bg-green-500 dark:text-white">Completed ✓</Badge>
              ) : (
                <Badge variant="outline">Not Submitted</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            {result ? (
              // Show actual test results when code has been run
              result.error ? (
                <Alert variant="destructive">
                  <p className="font-semibold">Error:</p>
                  <p className="text-sm mt-1 break-words">{result.error}</p>
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
                          className="mt-0.5 shrink-0"
                        >
                          {test.passed ? '✓' : '✗'}
                        </Badge>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="font-semibold text-sm break-words dark:text-background">{test.description}</p>
                          <div className="mt-2 text-sm space-y-1">
                            <p className="break-words">
                              <span className="font-medium dark:text-background">Input:</span>{' '}
                              <span className="break-all dark:text-background">{JSON.stringify(test.input)}</span>
                            </p>
                            <p className="break-words">
                              <span className="font-medium dark:text-background">Expected:</span>{' '}
                              <span className="break-all dark:text-background">{JSON.stringify(test.expected)}</span>
                            </p>
                            <p className="break-words">
                              <span className="font-medium dark:text-background">Got:</span>{' '}
                              <span className="break-all dark:text-background">{JSON.stringify(test.actual)}</span>
                            </p>
                            {test.error && (
                              <p className="text-red-600 break-words">
                                <span className="font-medium dark:text-background">Error:</span> {test.error}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}

                  {result.executionTimeMs != null && (
                    <p className="text-xs text-gray-600 text-right">
                      Execution time: {result.executionTimeMs}ms
                    </p>
                  )}
                </div>
              )
            ) : lessonStatus === 'completed' ? (
              // Show completion message if lesson is already completed
              <Alert className="bg-green-50 border-green-200 dark:text-background">
                <p className="text-sm text-chart-1">
                  You already completed this challenge. Feel free to move on to the next one or continue practicing!
                </p>
              </Alert>
            ) : (
              // Show default message if no submissions yet
              <Alert>
                <p className="text-sm text-muted-foreground">
                  You haven't submitted any attempts yet. Click "Run Code" to test your solution.
                </p>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
