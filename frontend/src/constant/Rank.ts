import { RankType } from '@type/Rank';

const RANK_OPTIONS: { value: RankType; label: string }[] = [
  { value: 'traffic', label: '트래픽양' },
  { value: 'success-rate', label: '요청 성공률' },
  { value: 'elapsed-time', label: '평균 응답시간' },
  { value: 'dau', label: 'DAU' }
];

export { RANK_OPTIONS };
