import { requireAuth } from '@/lib/auth/session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAllPhasesWithProgress } from '@/lib/progress/phase-gating';
import { getUserStats } from '@/lib/progress/queries';

export default async function DashboardPage() {
  const user = await requireAuth();
  const phasesWithProgress = await getAllPhasesWithProgress(user.id);
  const userStats = await getUserStats(user.id);

  const completedPhases = phasesWithProgress.filter(p => p.progress?.status === 'completed').length;
  const overallProgress = phasesWithProgress.length > 0 ? (completedPhases / phasesWithProgress.length) * 100 : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-chart-1">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary">In Progress</Badge>;
      case 'unlocked':
        return <Badge className="bg-chart-5">Ready to Start</Badge>;
      case 'locked':
        return <Badge variant="secondary">Locked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Continue your JavaScript learning journey</p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>
              {completedPhases} of {phasesWithProgress.length} phases completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">{Math.round(overallProgress)}% complete</p>
          </CardContent>
        </Card>

        {/* Phases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Learning Phases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phasesWithProgress.map((phase) => {
              const status = phase.progress?.status || 'locked';
              const isAccessible = status === 'unlocked' || status === 'in_progress' || status === 'completed';
              const lessonProgress = phase.totalLessons > 0
                ? (phase.completedLessons / phase.totalLessons) * 100
                : 0;

              return (
                <Card
                  key={phase.id}
                  className={`border-2 transition-all ${
                    isAccessible ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: phase.color || '#fff',
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Phase {phase.phaseNumber}</Badge>
                      {getStatusBadge(status)}
                    </div>
                    <CardTitle className="text-xl">{phase.title}</CardTitle>
                    <CardDescription className="text-gray-700">
                      {phase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {phase.totalLessons > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-foreground mb-1">
                          <span>Lessons</span>
                          <span>{phase.completedLessons} / {phase.totalLessons}</span>
                        </div>
                        <Progress value={lessonProgress} className="h-2" />
                      </div>
                    )}
                    {isAccessible ? (
                      <Link href={`/phase-${phase.phaseNumber}`}>
                        <Button className="w-full">
                          {status === 'completed' ? 'Review' : 'Continue'}
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full">
                        Complete previous phases to unlock
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lessons Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userStats.lessonsCompleted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {Math.floor(userStats.totalTimeSpent / 3600)}h
              </p>
              <p className="text-sm text-gray-600">
                {Math.floor((userStats.totalTimeSpent % 3600) / 60)}m
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {userStats.totalSubmissions > 0
                  ? Math.round((userStats.successfulSubmissions / userStats.totalSubmissions) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">
                {userStats.successfulSubmissions} / {userStats.totalSubmissions} submissions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hints Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userStats.hintsUsed}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
