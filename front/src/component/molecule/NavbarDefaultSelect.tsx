import { BOOST_CAMP_OPTION } from '@constant/NavbarSelect';

import NavbarSelect from './NavbarSelect';

type Props = {
  generation: string;
  selectedGroup: string;
  setGeneration: (value: string) => void;
  setSelectedGroup: (value: string) => void;
};

export default function NavbarDefaultSelect({
  generation,
  selectedGroup,
  setGeneration,
  setSelectedGroup
}: Props) {
  return (
    <NavbarSelect
      generation={generation}
      selectedGroup={selectedGroup}
      setGeneration={setGeneration}
      setSelectedGroup={setSelectedGroup}
      groupOption={BOOST_CAMP_OPTION}
    />
  );
}
