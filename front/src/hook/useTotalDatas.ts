import { getTotalTraffic } from '@api/get';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function useTotalDatas() {
  return useSuspenseQuery({
    queryKey: ['totalTraffic'],
    queryFn: () => getTotalTraffic()
  });
}
