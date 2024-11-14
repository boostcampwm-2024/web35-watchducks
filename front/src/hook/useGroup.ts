import { getGroups } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useGroups(generation: string) {
  return useSuspenseQuery({
    queryKey: ['groups', generation],
    queryFn: () => getGroups(generation)
  });
}
