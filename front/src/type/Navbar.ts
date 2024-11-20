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
type NavbarSelectProps = {
  generation: string;
  selectedGroup: string;
  setGeneration: (value: string) => void;
  setSelectedGroup: (value: string) => void;
  groupOption?: GroupOption[];
};

export type { Generation, GroupOption, MenuItem, NavbarSelectProps };
