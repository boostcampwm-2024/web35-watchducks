import {
  getRankingTraffic,
  getRankingSuccessRate,
  getRankingElapsedTime,
  getRankingDAU
} from '@api/get/RankingPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useRankData(rankType: string, generation: string) {
  const now = new Date();
  const tomorrowMidnight = new Date();
  tomorrowMidnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = tomorrowMidnight.getTime() - now.getTime();

  const queryOptions = {
    staleTime: tomorrowMidnight.getTime(),
    gcTime: timeUntilMidnight
  };

  switch (rankType) {
    case 'traffic':
      return useSuspenseQuery({
        queryKey: ['rankingTraffic', rankType, generation],
        queryFn: () => getRankingTraffic(generation),
        ...queryOptions
      });
    case 'success-rate':
      return useSuspenseQuery({
        queryKey: ['rankingSuccessRate', rankType, generation],
        queryFn: () => getRankingSuccessRate(generation),
        ...queryOptions
      });
    case 'elapsed-time':
      return useSuspenseQuery({
        queryKey: ['rankingElapsedTime', rankType, generation],
        queryFn: () => getRankingElapsedTime(generation),
        ...queryOptions
      });
    case 'dau':
      return useSuspenseQuery({
        queryKey: ['rankingDAU', rankType, generation],
        queryFn: () => getRankingDAU(generation),
        ...queryOptions
      });
    default:
      throw new Error('Invalid rank');
  }
}
