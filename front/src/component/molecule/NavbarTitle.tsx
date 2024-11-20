import H1 from '@component/atom/H1';
import P from '@component/atom/P';
import { useNavigate } from 'react-router-dom';

export default function NavbarTitle() {
  const navigate = useNavigate();

  const navigateMain = () => {
    navigate('/');
  };

  return (
    <div className='w-full'>
      <div
        className='flex min-w-0 cursor-pointer items-center gap-2 md:gap-4'
        onClick={navigateMain}>
        <P cssOption='text-16 md:text-20 lg:text-24 shrink-0' content='🐥' />
        <H1 cssOption='font-bold text-16 md:text-20 lg:text-24 truncate' content='WatchDucks' />
      </div>
    </div>
  );
}
