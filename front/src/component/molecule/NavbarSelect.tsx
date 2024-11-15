import Select from '@component/atom/Select';
import { BOOST_CAMP_OPTION, GENERATION_OPTION, GENERATION_VALUE } from '@constant/NavbarSelect';
import { GroupOption } from '@type/Navbar';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  generation: string;
  selectedGroup: string;
  setGeneration: (value: string) => void;
  setSelectedGroup: (value: string) => void;
  groupOption: GroupOption[];
};

export default function NavbarSelect({
  generation,
  selectedGroup,
  setGeneration,
  setSelectedGroup,
  groupOption = []
}: Props) {
  const { pathname } = useLocation();
  const isProjectPath = pathname === '/project';

  useEffect(() => {
    setGeneration(GENERATION_VALUE.NINTH);
    setSelectedGroup(isProjectPath ? groupOption[0]?.value : BOOST_CAMP_OPTION[0].value);
  }, [pathname, groupOption]);

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
