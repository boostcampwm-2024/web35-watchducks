import { DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS, TIME_OFFSET } from '@constant/Time';

const formatKoreanDate = (date: Date) => {
  const koreaDate = new Date(date.getTime() + TIME_OFFSET);
  return koreaDate.toLocaleString('ko-KR', DATE_FORMAT_OPTIONS);
};

const formatKoreanTime = (date: Date) => {
  const koreaDate = new Date(date.getTime() + TIME_OFFSET);
  return koreaDate.toLocaleString('ko-KR', TIME_FORMAT_OPTIONS);
};

export { formatKoreanTime, formatKoreanDate };
