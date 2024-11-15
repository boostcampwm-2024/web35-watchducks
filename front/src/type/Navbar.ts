type Generation = 'all' | '9';
type GroupOption = {
  readonly value: string;
  readonly label: string;
};
type MenuItem = {
  path: string;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
};
type Ranking = {
  host: string;
  count: string;
};

export type { Generation, GroupOption, MenuItem, Ranking };
