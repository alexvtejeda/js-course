import { db } from './index';
import { phases, lessons } from './schema';
import { eq } from 'drizzle-orm';

export async function seedPhases() {
  const phasesData = [
    {
      phaseNumber: 1,
      title: 'JavaScript Fundamentals',
      description: 'Review core JavaScript concepts including loops, arrays, and variable declaration',
      icon: 'code',
      color: '#FFF3E0',
      completionType: 'automated',
    },
    {
      phaseNumber: 2,
      title: 'Promises & Async',
      description: 'Master asynchronous JavaScript with promises and async/await',
      icon: 'timer',
      color: '#F3E5F5',
      completionType: 'automated',
    },
    {
      phaseNumber: 3,
      title: 'React Basics & Chess Setup',
      description: 'Learn React fundamentals while setting up the chess board',
      icon: 'layout',
      color: '#E8F5E9',
      completionType: 'checklist',
    },
    {
      phaseNumber: 4,
      title: 'Chess Game Logic',
      description: 'Implement piece movement, check, and checkmate detection',
      icon: 'chess',
      color: '#FFF9C4',
      completionType: 'code_review',
    },
    {
      phaseNumber: 5,
      title: 'AI Integration',
      description: 'Integrate Ollama and Chess-Llama for AI-powered gameplay',
      icon: 'brain',
      color: '#FFEBEE',
      completionType: 'automated',
    },
  ];

  console.log('Seeding phases...');

  for (const phase of phasesData) {
    await db.insert(phases).values(phase).onConflictDoNothing();
  }

  console.log('Phases seeded successfully!');
}

export async function seedLessons() {
  console.log('Seeding lessons...');

  // Get Phase 1
  const phase1 = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, 1),
  });

  if (!phase1) {
    console.error('Phase 1 not found. Run seedPhases first.');
    return;
  }

  // Phase 1 exercises
  const phase1Lessons = [
    {
      lessonNumber: 1,
      title: 'FizzBuzz',
      slug: 'fizzbuzz',
      description: 'Practice loops and conditionals with the classic FizzBuzz problem',
      exerciseId: 'fizzbuzz',
    },
    {
      lessonNumber: 2,
      title: 'Sum Array Elements',
      slug: 'sum-array',
      description: 'Calculate the sum of all numbers in an array using a loop',
      exerciseId: 'sum-array',
    },
    {
      lessonNumber: 3,
      title: 'Find Maximum Value',
      slug: 'find-max',
      description: 'Find the largest number in an array',
      exerciseId: 'find-max',
    },
    {
      lessonNumber: 4,
      title: 'Reverse a String',
      slug: 'reverse-string',
      description: 'Reverse the characters in a string using a loop',
      exerciseId: 'reverse-string',
    },
    {
      lessonNumber: 5,
      title: 'Count Vowels',
      slug: 'count-vowels',
      description: 'Count the number of vowels in a string',
      exerciseId: 'count-vowels',
    },
    {
      lessonNumber: 6,
      title: 'Filter Even Numbers',
      slug: 'filter-evens',
      description: 'Create a new array containing only even numbers',
      exerciseId: 'filter-evens',
    },
    {
      lessonNumber: 7,
      title: 'Calculate Factorial',
      slug: 'factorial',
      description: 'Calculate the factorial of a number using a loop',
      exerciseId: 'factorial',
    },
    {
      lessonNumber: 8,
      title: 'Check Palindrome',
      slug: 'palindrome',
      description: 'Determine if a string reads the same forwards and backwards',
      exerciseId: 'palindrome',
    },
    {
      lessonNumber: 9,
      title: 'Chunk Array',
      slug: 'array-chunk',
      description: 'Split an array into chunks of a specified size',
      exerciseId: 'array-chunk',
    },
    {
      lessonNumber: 10,
      title: 'Flatten Nested Array',
      slug: 'flatten-array',
      description: 'Convert a nested array into a single-level array',
      exerciseId: 'flatten-array',
    },
    {
      lessonNumber: 11,
      title: 'Remove Duplicates',
      slug: 'remove-duplicates',
      description: 'Create an array with duplicate values removed',
      exerciseId: 'remove-duplicates',
    },
    {
      lessonNumber: 12,
      title: 'Create Range Array',
      slug: 'range-array',
      description: 'Generate an array of numbers within a specified range',
      exerciseId: 'range-array',
    },
    {
      lessonNumber: 13,
      title: 'Title Case String',
      slug: 'title-case',
      description: 'Convert a string to title case',
      exerciseId: 'title-case',
    },
    {
      lessonNumber: 14,
      title: 'Count Word Occurrences',
      slug: 'word-count',
      description: 'Count how many times each word appears in a string',
      exerciseId: 'word-count',
    },
    {
      lessonNumber: 15,
      title: 'Array Intersection',
      slug: 'array-intersection',
      description: 'Find common elements between two arrays',
      exerciseId: 'array-intersection',
    },
  ];

  for (const lesson of phase1Lessons) {
    await db.insert(lessons).values({
      phaseId: phase1.id,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      type: 'exercise',
      content: {
        exerciseId: lesson.exerciseId,
      },
      requiredForCompletion: true,
    }).onConflictDoNothing();
  }

  console.log('Phase 1 lessons seeded successfully!');

  // Get Phase 2
  const phase2 = await db.query.phases.findFirst({
    where: eq(phases.phaseNumber, 2),
  });

  if (!phase2) {
    console.error('Phase 2 not found. Run seedPhases first.');
    return;
  }

  // Phase 2 exercises
  const phase2Lessons = [
    {
      lessonNumber: 1,
      title: 'Create a Basic Promise',
      slug: 'basic-promise',
      description: 'Learn how to create and use a simple Promise',
      exerciseId: 'basic-promise',
    },
    {
      lessonNumber: 2,
      title: 'Promise Chaining',
      slug: 'promise-chain',
      description: 'Chain multiple promises together',
      exerciseId: 'promise-chain',
    },
    {
      lessonNumber: 3,
      title: 'Basic Async/Await',
      slug: 'async-await-basic',
      description: 'Convert promise-based code to async/await',
      exerciseId: 'async-await-basic',
    },
    {
      lessonNumber: 4,
      title: 'Promise Error Handling',
      slug: 'error-handling',
      description: 'Handle errors in promises with catch',
      exerciseId: 'error-handling',
    },
    {
      lessonNumber: 5,
      title: 'Try/Catch with Async/Await',
      slug: 'try-catch-async',
      description: 'Handle errors using try/catch in async functions',
      exerciseId: 'try-catch-async',
    },
    {
      lessonNumber: 6,
      title: 'Promise.all() - Parallel Execution',
      slug: 'promise-all',
      description: 'Run multiple promises in parallel',
      exerciseId: 'promise-all',
    },
    {
      lessonNumber: 7,
      title: 'Sequential Promise Execution',
      slug: 'sequential-promises',
      description: 'Execute promises one after another in sequence',
      exerciseId: 'sequential-promises',
    },
    {
      lessonNumber: 8,
      title: 'Promise.race() - First to Finish',
      slug: 'promise-race',
      description: 'Use Promise.race() to get the first resolved promise',
      exerciseId: 'promise-race',
    },
    {
      lessonNumber: 9,
      title: 'Retry Failed Operations',
      slug: 'retry-logic',
      description: 'Implement retry logic for async operations',
      exerciseId: 'retry-logic',
    },
    {
      lessonNumber: 10,
      title: 'Async Array Map',
      slug: 'async-map',
      description: 'Map an array with async transformations',
      exerciseId: 'async-map',
    },
  ];

  for (const lesson of phase2Lessons) {
    await db.insert(lessons).values({
      phaseId: phase2.id,
      lessonNumber: lesson.lessonNumber,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description,
      type: 'exercise',
      content: {
        exerciseId: lesson.exerciseId,
      },
      requiredForCompletion: true,
    }).onConflictDoNothing();
  }

  console.log('Phase 2 lessons seeded successfully!');
}

// Run seed if called directly
if (require.main === module) {
  seedPhases()
    .then(() => seedLessons())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error seeding database:', err);
      process.exit(1);
    });
}
