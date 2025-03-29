import { getTop5Traffic } from '@api/get/MainPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useTop5Traffic(generation: string) {
  return useSuspenseQuery({
    queryKey: ['Top5Traffic', generation],
    queryFn: () => getTop5Traffic(generation)
  });
}
