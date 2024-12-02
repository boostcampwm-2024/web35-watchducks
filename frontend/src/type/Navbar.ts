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

type NavbarState = {
  generation: string;
  selectedGroup: string;
  isNavbarOpen: boolean;
  setGeneration: (generation: string) => void;
  setSelectedGroup: (group: string) => void;
  toggleNavbar: (isOpen?: boolean) => void;
};

type Dimensions = {
  width: number;
  height: number;
};

export type { Generation, GroupOption, MenuItem, NavbarState, Dimensions };
