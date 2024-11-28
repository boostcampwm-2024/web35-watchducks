import {
  getTotalTrafficCount,
  getTotalProjectCount,
  getTotalResponseRate,
  getDailyDifferenceTraffic,
  getTotalElapsedTime
} from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useTotalDatas(generation: string) {
  const { data: trafficData } = useSuspenseQuery({
    queryKey: ['totalTraffic', generation],
    queryFn: () => getTotalTrafficCount(generation)
  });

  const { data: projectData } = useSuspenseQuery({
    queryKey: ['totalProjectCount', generation],
    queryFn: () => getTotalProjectCount(generation)
  });

  const { data: responseData } = useSuspenseQuery({
    queryKey: ['totalResponseRate', generation],
    queryFn: () => getTotalResponseRate(generation)
  });

  const { data: dailyDifferenceTraffic } = useSuspenseQuery({
    queryKey: ['dailyDifferenceTraffic', generation],
    queryFn: () => getDailyDifferenceTraffic(generation)
  });

  const { data: elapsedTime } = useSuspenseQuery({
    queryKey: ['elapsedTime', generation],
    queryFn: () => getTotalElapsedTime(generation)
  });

  return {
    totalTraffic: trafficData.count,
    totalProjectCount: projectData.count,
    totalResponseRate: responseData.success_rate,
    dailyDifferenceTraffic: dailyDifferenceTraffic.traffic_daily_difference,
    elapsedTime: elapsedTime.avg_elapsed_time
  };
}
