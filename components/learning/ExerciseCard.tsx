import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from './CodeEditor';
import type { ExerciseConfig } from '@/types/exercise';

interface ExerciseCardProps {
  exercise: ExerciseConfig;
  lessonId: string;
  phase: number;
  onSuccess?: () => void;
}

export function ExerciseCard({ exercise, lessonId, phase, onSuccess }: ExerciseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">{exercise.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
              {exercise.timeEstimateMinutes && (
                <Badge variant="outline">
                  ~{exercise.timeEstimateMinutes} min
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-base">
            {exercise.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Instructions */}
            <div>
              <h3 className="font-semibold mb-2">Instructions</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {exercise.instructions}
                </pre>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <h3 className="font-semibold mb-2">What you'll learn</h3>
              <ul className="list-disc list-inside space-y-1">
                {exercise.learningObjectives.map((objective, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {exercise.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <CodeEditor
        lessonId={lessonId}
        exerciseId={exercise.id}
        phase={phase}
        starterCode={exercise.starterCode}
        onSuccess={onSuccess}
      />
    </div>
  );
}
