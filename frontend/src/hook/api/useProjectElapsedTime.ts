import { getElapsedTime } from '@api/get/ProjectPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectElapsedTime(project: string) {
  return useSuspenseQuery({
    queryKey: ['projectElapsedTime', project],
    queryFn: () => getElapsedTime(project)
  });
}
