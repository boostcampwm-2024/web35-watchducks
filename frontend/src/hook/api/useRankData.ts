import {
  getRankingTraffic,
  getRankingSuccessRate,
  getRankingElapsedTime,
  getRankingDAU
} from '@api/get/RankingPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useRankData(rankType: string, generation: string) {
  const queryOptions = {
    staleTime: 3600000,
    gcTime: 86400000
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
