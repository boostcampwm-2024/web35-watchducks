import { getSuccessRate } from '@api/get/ProjectPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectSuccessRate(project: string) {
  return useSuspenseQuery({
    queryKey: ['projectSuccessRate', project],
    queryFn: () => getSuccessRate(project)
  });
}
