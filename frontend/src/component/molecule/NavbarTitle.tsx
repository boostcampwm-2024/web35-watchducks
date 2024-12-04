import FaviconImg from '@asset/image/Favicon.svg';
import H1 from '@component/atom/H1';
import Img from '@component/atom/Img';
import { useNavigate } from 'react-router-dom';

export default function NavbarTitle() {
  const navigate = useNavigate();

  const navigateMain = () => {
    navigate('/');
  };

  return (
    <div className='my-2 w-full'>
      <div className='flex min-w-0 cursor-pointer items-center gap-2' onClick={navigateMain}>
        <Img src={FaviconImg} cssOption='w-[36px]' alt='와치덕스 로고 이미지' />
        <H1 cssOption='font-bold text-[1.6vw] truncate dark:text-white' content='WatchDucks' />
      </div>
    </div>
  );
}
