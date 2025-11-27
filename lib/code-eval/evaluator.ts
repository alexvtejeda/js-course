import type { ExerciseConfig, ExerciseResult, TestCaseResult } from '@/types/exercise';

/**
 * Code evaluation system for Phases 1-2
 * Safely executes user code in a controlled environment
 */

const EXECUTION_TIMEOUT = 5000; // 5 seconds

/**
 * Evaluate user code against test cases
 */
export async function evaluateCode(
  userCode: string,
  exercise: ExerciseConfig
): Promise<ExerciseResult> {
  const startTime = Date.now();
  const testResults: TestCaseResult[] = [];
  let allPassed = true;

  try {
    // Extract function name from user code
    const functionName = extractFunctionName(userCode);

    if (!functionName) {
      return {
        passed: false,
        testResults: [],
        error: 'Could not find a function declaration in your code',
        executionTimeMs: Date.now() - startTime,
      };
    }

    // Create function from user code
    let userFunction: Function;
    try {
      // Use Function constructor for safer execution
      const functionBody = `
        ${userCode}
        return ${functionName};
      `;
      userFunction = new Function(functionBody)();
    } catch (error: any) {
      return {
        passed: false,
        testResults: [],
        error: `Syntax error: ${error.message}`,
        executionTimeMs: Date.now() - startTime,
      };
    }

    // Run each test case
    for (const testCase of exercise.testCases) {
      try {
        // Execute with timeout
        const result = await executeWithTimeout(
          () => userFunction(testCase.input),
          EXECUTION_TIMEOUT
        );

        // Compare result with expected
        const passed = deepEqual(result, testCase.expected);

        testResults.push({
          description: testCase.description,
          passed,
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
        });

        if (!passed) {
          allPassed = false;
        }
      } catch (error: any) {
        testResults.push({
          description: testCase.description,
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          error: error.message || 'Unknown error',
        });
        allPassed = false;
      }
    }

    return {
      passed: allPassed,
      testResults,
      executionTimeMs: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      passed: false,
      testResults,
      error: error.message || 'Unknown error during evaluation',
      executionTimeMs: Date.now() - startTime,
    };
  }
}

/**
 * Execute function with timeout
 */
async function executeWithTimeout<T>(
  fn: () => T,
  timeoutMs: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Execution timeout'));
    }, timeoutMs);

    try {
      const result = fn();
      clearTimeout(timer);
      resolve(result);
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
}

/**
 * Extract function name from code
 */
function extractFunctionName(code: string): string | null {
  // Match function declarations: function name(...) or const name = ...
  const functionMatch = code.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
  if (functionMatch) {
    return functionMatch[1];
  }

  const constMatch = code.match(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
  if (constMatch) {
    return constMatch[1];
  }

  const letMatch = code.match(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
  if (letMatch) {
    return letMatch[1];
  }

  const varMatch = code.match(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
  if (varMatch) {
    return varMatch[1];
  }

  return null;
}

/**
 * Deep equality comparison
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (typeof a !== typeof b) return false;

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Handle objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return false;
}

/**
 * Validate code syntax
 */
export function validateSyntax(code: string): { valid: boolean; error?: string } {
  try {
    new Function(code);
    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || 'Syntax error',
    };
  }
}

/**
 * Load exercise configuration from file
 */
export async function loadExerciseConfig(
  phase: number,
  exerciseId: string
): Promise<ExerciseConfig | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    const configPath = path.join(
      process.cwd(),
      'config',
      'exercises',
      `phase-${phase}`,
      `${exerciseId}.json`
    );

    const fileContent = await fs.readFile(configPath, 'utf-8');
    const config: ExerciseConfig = JSON.parse(fileContent);

    return config;
  } catch (error) {
    console.error('Failed to load exercise config:', error);
    return null;
  }
}

/**
 * Get visible test cases (non-hidden)
 */
export function getVisibleTestCases(exercise: ExerciseConfig) {
  return exercise.testCases.filter((tc) => !tc.hidden);
}

/**
 * Get hint by level
 */
export function getHint(exercise: ExerciseConfig, level: 1 | 2 | 3) {
  return exercise.hints.find((h) => h.level === level);
}
