import { getGroupNames } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useGroupNames(generation: string) {
  return useSuspenseQuery({
    queryKey: ['groupNames', generation],
    queryFn: () => getGroupNames(generation)
  });
}
