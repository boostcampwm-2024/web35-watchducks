import { RankType } from '@type/Rank';

const RANK_OPTIONS: { value: RankType; label: string }[] = [
  { value: { name: 'traffic', unit: '개' }, label: '트래픽양' },
  { value: { name: 'success-rate', unit: '%' }, label: '요청 성공률' },
  { value: { name: 'elapsed-time', unit: 'ms' }, label: '평균 응답시간' },
  { value: { name: 'dau', unit: '명' }, label: 'DAU' }
];

export { RANK_OPTIONS };
