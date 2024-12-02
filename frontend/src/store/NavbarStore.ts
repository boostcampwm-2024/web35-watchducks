import { BOOST_CAMP_OPTION, GENERATION_VALUE } from '@constant/NavbarSelect';
import { NavbarState } from '@type/Navbar';
import { create } from 'zustand';

const useNavbarStore = create<NavbarState>((set) => ({
  generation: GENERATION_VALUE.NINTH,
  selectedGroup: BOOST_CAMP_OPTION[0].value,
  isNavbarOpen: true,
  setGeneration: (generation) => set({ generation }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  toggleNavbar: (isOpen) => set((state) => ({ isNavbarOpen: isOpen ?? !state.isNavbarOpen }))
}));

export default useNavbarStore;
