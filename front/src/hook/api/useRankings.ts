import { getRankings } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Ranking } from '@type/api';

export default function useRankings(generation: string) {
  return useSuspenseQuery<Ranking[]>({
    queryKey: ['ranking', generation],
    queryFn: () => getRankings(generation)
  });
}
