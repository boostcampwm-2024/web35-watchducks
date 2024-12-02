import { BOOST_CAMP_OPTION, GENERATION_VALUE } from '@constant/NavbarSelect';
import { create } from 'zustand';

type NavbarState = {
  generation: string;
  selectedGroup: string;
  isNavbarOpen: boolean;
  setGeneration: (generation: string) => void;
  setSelectedGroup: (group: string) => void;
  toggleNavbar: (isOpen?: boolean) => void;
};

const useNavbarStore = create<NavbarState>((set) => ({
  generation: GENERATION_VALUE.NINTH,
  selectedGroup: BOOST_CAMP_OPTION[0].value,
  isNavbarOpen: true,
  setGeneration: (generation) => set({ generation }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  toggleNavbar: (isOpen) => set((state) => ({ isNavbarOpen: isOpen ?? !state.isNavbarOpen }))
}));

export default useNavbarStore;
