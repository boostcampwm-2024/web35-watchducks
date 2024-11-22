import { getTop5Traffic } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Top5Traffic } from '@type/api';

export default function useTop5Traffic(generation: string) {
  return useSuspenseQuery<Top5Traffic[]>({
    queryKey: ['Top5Traffic', generation],
    queryFn: () => getTop5Traffic(generation)
  });
}
