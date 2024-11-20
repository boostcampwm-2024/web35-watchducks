import { getTotalTraffic, getTotalProjectCount, getTotalResponseRate } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useTotalDatas(generation: string) {
  const { data: trafficData } = useSuspenseQuery({
    queryKey: ['totalTraffic'],
    queryFn: () => getTotalTraffic()
  });

  const { data: projectData } = useSuspenseQuery({
    queryKey: ['totalProjectCount', generation],
    queryFn: () => getTotalProjectCount(generation)
  });

  const { data: responseData } = useSuspenseQuery({
    queryKey: ['totalResponseRate'],
    queryFn: () => getTotalResponseRate()
  });

  return {
    totalTraffic: trafficData.count,
    totalProjectCount: projectData.count,
    totalResponseRate: responseData.success_rate
  };
}
