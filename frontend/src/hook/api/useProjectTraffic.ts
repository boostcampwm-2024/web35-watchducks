import { getTraffic } from '@api/get/ProjectPage';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useProjectTraffic(project: string, dateType: string) {
  return useSuspenseQuery({
    queryKey: ['projectTraffic', project, dateType],
    queryFn: () => getTraffic(project, dateType)
  });
}
