import { getRakings } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Ranking } from '@type/Navbar';

export default function useRankings() {
  return useSuspenseQuery<Ranking[]>({
    queryKey: ['ranking'],
    queryFn: () => getRakings()
  });
}
