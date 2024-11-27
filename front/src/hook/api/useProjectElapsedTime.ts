import { getElapsedTime } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectElapsedTime(project: string) {
  return useSuspenseQuery({
    queryKey: ['projectElapsedTime', project],
    queryFn: () => getElapsedTime(project)
  });
}
