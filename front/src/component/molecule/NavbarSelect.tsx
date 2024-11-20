import Select from '@component/atom/Select';
import { GENERATION_OPTION } from '@constant/NavbarSelect';
import { PATH } from '@constant/Path';
import { NavbarSelectProps } from '@type/Navbar';
import { useLocation } from 'react-router-dom';

type Props = NavbarSelectProps;

export default function NavbarSelect({
  generation,
  selectedGroup,
  setGeneration,
  setSelectedGroup,
  groupOption
}: Props) {
  const { pathname } = useLocation();
  const isProjectPath = pathname === PATH.PROJECT;

  return (
    <div className='mt-8 flex w-full min-w-0 items-center justify-between rounded-1.5 border-1.5 border-solid border-gray p-4 md:mt-16 md:gap-[4px] md:p-8'>
      {isProjectPath && (
        <Select
          cssOption='text-12 md:text-14 md:px-2 text-ellipsis cursor-pointer hover:font-semibold truncate'
          options={GENERATION_OPTION}
          value={generation}
          onChange={setGeneration}
        />
      )}
      <Select
        cssOption='text-12 md:text-14 md:px-2 text-ellipsis cursor-pointer text-gray hover:font-semibold truncate flex-1'
        options={groupOption}
        value={selectedGroup}
        onChange={setSelectedGroup}
      />
    </div>
  );
}
