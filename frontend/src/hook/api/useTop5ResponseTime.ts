import { getTop5ResponseTime } from '@api/get/MainPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useTop5ResponseTime(generation: string) {
  return useSuspenseQuery({
    queryKey: ['Top5ResponseTime', generation],
    queryFn: () => getTop5ResponseTime(generation)
  });
}
