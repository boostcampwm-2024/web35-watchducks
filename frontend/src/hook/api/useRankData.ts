import {
  getRankingTraffic,
  getRankingSuccessRate,
  getRankingElapsedTime,
  getRankingDAU
} from '@api/get/RankingPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useRankData(rankType: string, generation: string) {
  switch (rankType) {
    case 'traffic':
      return useSuspenseQuery({
        queryKey: ['rankingTraffic', rankType, generation],
        queryFn: () => getRankingTraffic(generation)
      });
    case 'success-rate':
      return useSuspenseQuery({
        queryKey: ['rankingSuccessRate', rankType, generation],
        queryFn: () => getRankingSuccessRate(generation)
      });
    case 'elapsed-time':
      return useSuspenseQuery({
        queryKey: ['rankingElapsedTime', rankType, generation],
        queryFn: () => getRankingElapsedTime(generation)
      });
    case 'dau':
      return useSuspenseQuery({
        queryKey: ['rankingDAU', rankType, generation],
        queryFn: () => getRankingDAU(generation)
      });
    default:
      throw new Error('Invalid rank');
  }
}
