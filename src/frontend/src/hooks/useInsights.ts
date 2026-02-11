import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DailyLog } from '../backend';

export function useGetCompletionStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyLog[]>({
    queryKey: ['completionStats'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyLogsByCompletionStats();
    },
    enabled: !!actor && !actorFetching,
  });
}

