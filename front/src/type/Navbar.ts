type Generation = 'all' | '9th';
type GroupOption = {
  value: string;
  label: string;
};
type MenuItem = {
  path: string;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
};

export type { Generation, GroupOption, MenuItem };
