import H1 from '@component/atom/H1';
import DarkModeButton from '@component/molecule/DarkModeButton';
import { useNavigate } from 'react-router-dom';

export default function NavbarTitle() {
  const navigate = useNavigate();

  const navigateMain = () => {
    navigate('/');
  };

  return (
    <div className='my-2 w-full'>
      <div className='flex min-w-0 cursor-pointer items-center' onClick={navigateMain}>
        <DarkModeButton />
        <H1 cssOption='font-bold text-[1.6vw] truncate dark:text-white' content='WatchDucks' />
      </div>
    </div>
  );
}
