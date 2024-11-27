import { getSuccessRate } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectSuccessRate(project: string) {
  return useSuspenseQuery({
    queryKey: ['projectSuccessRate', project],
    queryFn: () => getSuccessRate(project)
  });
}
