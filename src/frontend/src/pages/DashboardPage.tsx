import { useGetAllDayLogs } from '../hooks/useDayLogs';
import { getTodayKey, getDayKey } from '../utils/dates';
import StudySection from '../components/daylog/StudySection';
import ExerciseSection from '../components/daylog/ExerciseSection';
import InsightsPanel from '../components/insights/InsightsPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data: dayLogs, isLoading, error } = useGetAllDayLogs();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
          <div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load your data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const todayKey = getTodayKey();
  const todayLog = dayLogs?.find(log => getDayKey(log.date) === todayKey);

  const studyItems = todayLog?.studyItems || [];
  const exerciseItems = todayLog?.exerciseItems || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Today's Plan</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StudySection studyItems={studyItems} exerciseItems={exerciseItems} />
          <ExerciseSection studyItems={studyItems} exerciseItems={exerciseItems} />
        </div>
        
        <div className="lg:col-span-1">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
}

