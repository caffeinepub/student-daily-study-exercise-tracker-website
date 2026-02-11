import { useGetCompletionStats } from '../../hooks/useInsights';
import { useGetAllDayLogs } from '../../hooks/useDayLogs';
import { getDayKey } from '../../utils/dates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Flame, BookOpen, Dumbbell } from 'lucide-react';

function calculateStreak(dayLogs: any[]): number {
  if (!dayLogs || dayLogs.length === 0) return 0;

  // Sort logs by date descending
  const sorted = [...dayLogs].sort((a, b) => Number(b.date - a.date));
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const log of sorted) {
    const logDate = new Date(Number(log.date / 1_000_000n));
    logDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check if this log has at least one completed item
    const hasCompleted = log.studyItems.some((i: any) => i.completed) || 
                        log.exerciseItems.some((i: any) => i.completed);
    
    if (daysDiff === streak && hasCompleted) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }
  
  return streak;
}

export default function InsightsPanel() {
  const { data: stats, isLoading: statsLoading } = useGetCompletionStats();
  const { data: dayLogs, isLoading: logsLoading } = useGetAllDayLogs();

  if (statsLoading || logsLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </CardContent>
      </Card>
    );
  }

  // Calculate weekly totals (last 7 days)
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  const weeklyStats = stats?.filter(stat => {
    // Stats don't have dates, so we'll use all available data as weekly
    return true;
  }) || [];

  const totalStudy = weeklyStats.reduce((sum, s) => sum + Number(s.totalStudyItems), 0);
  const completedStudy = weeklyStats.reduce((sum, s) => sum + Number(s.completedStudyItems), 0);
  const totalExercise = weeklyStats.reduce((sum, s) => sum + Number(s.totalExerciseItems), 0);
  const completedExercise = weeklyStats.reduce((sum, s) => sum + Number(s.completedExerciseItems), 0);

  const streak = calculateStreak(dayLogs || []);

  const studyPercentage = totalStudy > 0 ? Math.round((completedStudy / totalStudy) * 100) : 0;
  const exercisePercentage = totalExercise > 0 ? Math.round((completedExercise / totalExercise) * 100) : 0;

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-3xl font-bold">{streak}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {streak === 0 ? 'Complete an item to start your streak!' : 
             streak === 1 ? 'Great start! Keep it going!' : 
             'Amazing consistency! 🎉'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Study</span>
              </div>
              <Badge variant="secondary">{studyPercentage}%</Badge>
            </div>
            <div className="flex items-baseline gap-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{completedStudy}</span>
              <span>/</span>
              <span>{totalStudy}</span>
              <span>completed</span>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${studyPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg border bg-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-accent" />
                <span className="font-medium text-sm">Exercise</span>
              </div>
              <Badge variant="secondary">{exercisePercentage}%</Badge>
            </div>
            <div className="flex items-baseline gap-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{completedExercise}</span>
              <span>/</span>
              <span>{totalExercise}</span>
              <span>completed</span>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${exercisePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {totalStudy === 0 && totalExercise === 0 && (
          <p className="text-xs text-center text-muted-foreground pt-2">
            Add items to see your progress!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

