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

  // Add FizzBuzz exercise
  await db.insert(lessons).values({
    phaseId: phase1.id,
    lessonNumber: 1,
    title: 'FizzBuzz',
    slug: 'fizzbuzz',
    description: 'Practice loops and conditionals with the classic FizzBuzz problem',
    type: 'exercise',
    content: {
      exerciseId: 'fizzbuzz',
    },
    requiredForCompletion: true,
  }).onConflictDoNothing();

  console.log('Lessons seeded successfully!');
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
