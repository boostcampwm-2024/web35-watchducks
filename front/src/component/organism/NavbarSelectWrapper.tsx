import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarCustomSelect from '@component/molecule/NavbarCustomSelect';
import NavbarDefaultSelect from '@component/molecule/NavbarDefaultSelect';
import { useLocation } from 'react-router-dom';

type Props = {
  generation: string;
  selectedGroup: string;
  setGeneration: (value: string) => void;
  setSelectedGroup: (value: string) => void;
};

export default function NavbarSelectWrapper({
  generation,
  selectedGroup,
  setGeneration,
  setSelectedGroup
}: Props) {
  const { pathname } = useLocation();
  const isProjectPath = pathname === '/project';

  if (isProjectPath) {
    return (
      <CustomErrorBoundary>
        <NavbarCustomSelect
          generation={generation}
          selectedGroup={selectedGroup}
          setGeneration={setGeneration}
          setSelectedGroup={setSelectedGroup}
        />
      </CustomErrorBoundary>
    );
  }

  return (
    <NavbarDefaultSelect
      generation={generation}
      selectedGroup={selectedGroup}
      setGeneration={setGeneration}
      setSelectedGroup={setSelectedGroup}
    />
  );
}
