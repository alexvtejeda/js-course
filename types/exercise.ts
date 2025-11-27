/**
 * Exercise configuration types for Phases 1-2
 */

export interface TestCase {
  input: any;
  expected: any;
  description: string;
  hidden?: boolean;
}

export interface Hint {
  level: 1 | 2 | 3;
  content: string;
}

export interface ExerciseConfig {
  id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  solution: string;
  hints: Hint[];
  testCases: TestCase[];
  learningObjectives: string[];
  tags: string[];
  timeEstimateMinutes?: number;
}

export interface ExerciseResult {
  passed: boolean;
  testResults: TestCaseResult[];
  error?: string;
  executionTimeMs: number;
  output?: any;
}

export interface TestCaseResult {
  description: string;
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
  error?: string;
}
