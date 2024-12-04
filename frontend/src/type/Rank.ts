type RankType =
  | { name: 'traffic'; unit: '개' }
  | { name: 'success-rate'; unit: '%' }
  | { name: 'elapsed-time'; unit: 'ms' }
  | { name: 'dau'; unit: '명' };

export type { RankType };
