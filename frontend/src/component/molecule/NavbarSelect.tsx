import Select from '@component/atom/Select';
import { GENERATION_OPTION } from '@constant/NavbarSelect';
import { PATH } from '@constant/Path';
import useNavbarStore from '@store/NavbarStore';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  groupOption: Array<{ label: string; value: string }>;
};

export default function NavbarSelect({ groupOption }: Props) {
  const { generation, selectedGroup, setGeneration, setSelectedGroup } = useNavbarStore();
  const { pathname } = useLocation();
  const isProjectPath = pathname.includes(PATH.PROJECT);
  const navigate = useNavigate();
  const handleSelect = (value: string) => {
    setSelectedGroup(value);
    navigate(PATH.PROJECT + '/' + value);
  };

  return (
    <div className='flex w-full min-w-0 items-center justify-between rounded-[1.5px] border-[1.5px] border-solid border-gray p-4 md:gap-[4px] md:p-[8px]'>
      {isProjectPath && (
        <Select
          cssOption='text-[12px] md:text-[14px] md:px-2 text-ellipsis cursor-pointer hover:font-semibold truncate dark:text-white'
          options={GENERATION_OPTION}
          value={generation}
          onChange={setGeneration}
        />
      )}
      <Select
        cssOption='text-[12px] md:text-[14px] md:px-2 text-ellipsis cursor-pointer text-gray hover:font-semibold truncate flex-1'
        options={groupOption}
        value={selectedGroup}
        onChange={handleSelect}
      />
    </div>
  );
}
