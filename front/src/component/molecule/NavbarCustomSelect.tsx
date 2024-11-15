import useGroupNames from '@hook/useGroupNames';

import NavbarSelect from './NavbarSelect';

type Props = {
  generation: string;
  selectedGroup: string;
  setGeneration: (value: string) => void;
  setSelectedGroup: (value: string) => void;
};

export default function NavbarCustomSelect({
  generation,
  selectedGroup,
  setGeneration,
  setSelectedGroup
}: Props) {
  const { data } = useGroupNames(generation);
  return (
    <NavbarSelect
      generation={generation}
      selectedGroup={selectedGroup}
      setGeneration={setGeneration}
      setSelectedGroup={setSelectedGroup}
      groupOption={data}
    />
  );
}
