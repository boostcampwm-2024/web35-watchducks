import { getGroupNames } from '@api/get';
import { useQuery } from '@tanstack/react-query';

export default function useGroupNames(generation: string) {
  return useQuery({
    queryKey: ['groupNames', generation],
    queryFn: () => getGroupNames(generation),
  });
}
