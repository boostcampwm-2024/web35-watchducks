import { getIsExistProject } from '@api/get';
import { useQuery } from '@tanstack/react-query';

export default function useIsExistGroup(project: string) {
  return useQuery({
    queryKey: ['isExistProject', project],
    queryFn: () => getIsExistProject(project)
  });
}
