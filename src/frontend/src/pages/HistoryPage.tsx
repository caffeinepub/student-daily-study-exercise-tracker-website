import { useState } from 'react';
import { useGetAllDayLogs, useSaveDayLog } from '../hooks/useDayLogs';
import { getDayKey, getTodayKey, formatDate, formatDateShort } from '../utils/dates';
import { copyUnfinishedItems } from '../utils/copyUnfinished';
import type { DayLog } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, Copy, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryPage() {
  const { data: dayLogs, isLoading, error } = useGetAllDayLogs();
  const saveMutation = useSaveDayLog();
  const [selectedLog, setSelectedLog] = useState<DayLog | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96" />
          <div className="md:col-span-2">
            <Skeleton className="h-96" />
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
            Failed to load history. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const todayKey = getTodayKey();
  const sortedLogs = [...(dayLogs || [])].sort((a, b) => Number(b.date - a.date));
  const pastLogs = sortedLogs.filter(log => getDayKey(log.date) !== todayKey);
  const todayLog = sortedLogs.find(log => getDayKey(log.date) === todayKey);

  const handleCopyUnfinished = async (sourceLog: DayLog) => {
    if (!todayLog) {
      // No today log exists, create new one with copied items
      const newLog = copyUnfinishedItems(
        sourceLog.studyItems,
        sourceLog.exerciseItems,
        [],
        []
      );
      saveMutation.mutate(newLog);
    } else {
      // Merge with existing today log
      const mergedLog = copyUnfinishedItems(
        sourceLog.studyItems,
        sourceLog.exerciseItems,
        todayLog.studyItems,
        todayLog.exerciseItems
      );
      saveMutation.mutate(mergedLog);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">History</h1>
        <p className="text-muted-foreground">
          Browse your past logs and copy unfinished items to today
        </p>
      </div>

      {pastLogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No history yet. Start tracking today!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Past Days</CardTitle>
              <CardDescription>Select a day to view details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-4">
                  {pastLogs.map((log) => {
                    const completedStudy = log.studyItems.filter(i => i.completed).length;
                    const completedExercise = log.exerciseItems.filter(i => i.completed).length;
                    const totalItems = log.studyItems.length + log.exerciseItems.length;
                    const completedItems = completedStudy + completedExercise;

                    return (
                      <button
                        key={log.id.toString()}
                        onClick={() => setSelectedLog(log)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedLog?.id === log.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{formatDateShort(log.date)}</span>
                          <Badge variant={completedItems === totalItems && totalItems > 0 ? 'default' : 'secondary'}>
                            {completedItems}/{totalItems}
                          </Badge>
                        </div>
                        <div className="text-xs opacity-80">
                          {log.studyItems.length} study • {log.exerciseItems.length} exercise
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            {selectedLog ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{formatDate(selectedLog.date)}</CardTitle>
                      <CardDescription>
                        {selectedLog.studyItems.length} study items • {selectedLog.exerciseItems.length} exercise items
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleCopyUnfinished(selectedLog)}
                      disabled={saveMutation.isPending}
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Unfinished
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedLog.studyItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        Study Items
                        <Badge variant="secondary">{selectedLog.studyItems.length}</Badge>
                      </h3>
                      <div className="space-y-2">
                        {selectedLog.studyItems.map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border ${
                              item.completed ? 'bg-accent/10 border-accent/20' : 'bg-card'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {item.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium ${item.completed ? 'line-through opacity-60' : ''}`}>
                                  {item.title}
                                </p>
                                {item.notes && (
                                  <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLog.studyItems.length > 0 && selectedLog.exerciseItems.length > 0 && (
                    <Separator />
                  )}

                  {selectedLog.exerciseItems.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        Exercise Items
                        <Badge variant="secondary">{selectedLog.exerciseItems.length}</Badge>
                      </h3>
                      <div className="space-y-2">
                        {selectedLog.exerciseItems.map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border ${
                              item.completed ? 'bg-accent/10 border-accent/20' : 'bg-card'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {item.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium ${item.completed ? 'line-through opacity-60' : ''}`}>
                                  {item.description}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.reps.toString()} reps
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedLog.studyItems.length === 0 && selectedLog.exerciseItems.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No items logged for this day
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select a day from the list to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

