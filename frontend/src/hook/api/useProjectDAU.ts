import { getDAU } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectDAU(project: string) {
  return useSuspenseQuery({
    queryKey: ['projectDAU', project],
    queryFn: () => getDAU(project)
  });
}
