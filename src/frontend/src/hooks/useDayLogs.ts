import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DayLog, DailyLogInput } from '../backend';
import { toast } from 'sonner';

export function useGetAllDayLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DayLog[]>({
    queryKey: ['dayLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDayLogs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveDayLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: DailyLogInput) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveDayLog(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dayLogs'] });
      queryClient.invalidateQueries({ queryKey: ['completionStats'] });
      toast.success('Changes saved successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to save changes: ' + error.message);
    },
  });
}

