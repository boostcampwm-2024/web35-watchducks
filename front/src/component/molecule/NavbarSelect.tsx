import Select from '@component/atom/Select';
import { BOOST_CAMP_OPTION, GENERATION_OPTIONS, GENERATION_VALUE } from '@constant/NavbarSelect';
import { Generation } from '@type/Navbar';
import { GroupOption } from '@type/Navbar';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  generation: Generation;
  selectedGroup: string;
  setGeneration: (value: Generation) => void;
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
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/project') {
      setGeneration(GENERATION_VALUE.NINTH);
      if (groupOption.length > 0) {
        setSelectedGroup(groupOption[0].value);
      }
    } else {
      setGeneration(GENERATION_VALUE.ALL);
      setSelectedGroup(BOOST_CAMP_OPTION[0].value);
    }
  }, [pathname, groupOption]);

  const handleGenerationChange = (value: Generation) => {
    setGeneration(value);
    if (value === GENERATION_VALUE.ALL) {
      setSelectedGroup(BOOST_CAMP_OPTION[0].value);
      navigate('/');
    } else {
      setSelectedGroup('');
      navigate('/project');
    }
  };

  return (
    <div className='mt-8 flex w-full min-w-0 items-center justify-between rounded-1.5 border-1.5 border-solid border-gray p-4 md:mt-16 md:gap-[4px] md:p-8'>
      <Select
        cssOption='text-12 md:text-14 md:px-2 text-ellipsis cursor-pointer hover:font-semibold truncate'
        options={GENERATION_OPTIONS}
        value={generation}
        onChange={handleGenerationChange}
      />
      <Select
        cssOption='text-12 md:text-14 md:px-4 text-ellipsis cursor-pointer text-gray hover:font-semibold truncate flex-1'
        options={groupOption}
        value={selectedGroup}
        onChange={setSelectedGroup}
      />
    </div>
  );
}
