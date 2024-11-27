import { getRankings } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useRankings(generation: string) {
  return useSuspenseQuery({
    queryKey: ['ranking', generation],
    queryFn: () => getRankings(generation)
  });
}
