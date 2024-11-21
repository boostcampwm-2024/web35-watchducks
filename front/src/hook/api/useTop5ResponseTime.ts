import { getTop5ResponseTime } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ResponseTime } from '@type/api';

export default function useTop5ResponseTime(generation: string) {
  return useSuspenseQuery<ResponseTime[]>({
    queryKey: ['Top5ResponseTime', generation],
    queryFn: () => getTop5ResponseTime(generation)
  });
}
