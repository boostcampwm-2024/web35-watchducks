import { getRankings } from '@api/get/MainPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useRankings(generation: string) {
  return useSuspenseQuery({
    queryKey: ['ranking', generation],
    queryFn: () => getRankings(generation)
  });
}
