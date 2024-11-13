import NavbarSelect from '@component/molecule/NavbarSelect';
import { GENERATION_VALUE, BOOST_CAMP_OPTION } from '@constant/NavbarSelect';
import { useGroups } from '@hook/useGroup';
import { Generation } from '@type/Navbar';
import { GroupOption } from '@type/Navbar';

type Props = {
  generation: Generation;
  selectedGroup: string;
  setGeneration: (value: Generation) => void;
  setSelectedGroup: (value: string) => void;
};

export default function NavbarSelectWrapper({
  generation,
  selectedGroup,
  setGeneration,
  setSelectedGroup
}: Props) {
  const { data: projectGroups } = useGroups(generation);
  const groupOptions: GroupOption[] = Array.isArray(projectGroups) ? projectGroups : [];
  // api 연결시 isArray 제거

  const groupOption: GroupOption[] =
    generation === GENERATION_VALUE.ALL ? [...BOOST_CAMP_OPTION] : groupOptions;

  return (
    <NavbarSelect
      generation={generation}
      selectedGroup={selectedGroup}
      setGeneration={setGeneration}
      setSelectedGroup={setSelectedGroup}
      groupOption={groupOption}
    />
  );
}
