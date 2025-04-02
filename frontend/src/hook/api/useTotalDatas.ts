import {
  getTotalTrafficCount,
  getTotalProjectCount,
  getTotalResponseRate,
  getDailyDifferenceTraffic,
  getTotalElapsedTime
} from '@api/get/MainPage';
import { useSuspenseQueries } from '@tanstack/react-query';

export default function useTotalDatas(generation: string) {
  const [trafficResult, projectResult, responseResult, dailyDifferenceResult, elapsedTimeResult] =
    useSuspenseQueries({
      queries: [
        {
          queryKey: ['totalTraffic', generation],
          queryFn: () => getTotalTrafficCount(generation)
        },
        {
          queryKey: ['totalProjectCount', generation],
          queryFn: () => getTotalProjectCount(generation)
        },
        {
          queryKey: ['totalResponseRate', generation],
          queryFn: () => getTotalResponseRate(generation)
        },
        {
          queryKey: ['dailyDifferenceTraffic', generation],
          queryFn: () => getDailyDifferenceTraffic(generation)
        },
        {
          queryKey: ['elapsedTime', generation],
          queryFn: () => getTotalElapsedTime(generation)
        }
      ]
    });

  return {
    totalTraffic: trafficResult.data.count,
    totalProjectCount: projectResult.data.count,
    totalResponseRate: responseResult.data.success_rate,
    dailyDifferenceTraffic: dailyDifferenceResult.data.traffic_daily_difference,
    elapsedTime: elapsedTimeResult.data.avg_elapsed_time
  };
}
