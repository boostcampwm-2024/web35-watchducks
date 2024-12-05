import FaviconImg from '@asset/image/Favicon.png';
import FaviconLightImg from '@asset/image/FaviconLight.png';
import H1 from '@component/atom/H1';
import Img from '@component/atom/Img';
import DarkModeButton from '@component/molecule/DarkModeButton';
import useDarkMode from '@hook/useDarkMode';
import { useNavigate } from 'react-router-dom';

export default function NavbarTitle() {
  const navigate = useNavigate();
  const [isDark, toggleDarkMode] = useDarkMode();

  const navigateMain = () => {
    navigate('/');
  };

  return (
    <div className='my-2 w-full'>
      <div className='flex items-center gap-2' onClick={navigateMain}>
        <Img
          src={isDark ? FaviconLightImg : FaviconImg}
          alt='다크모드 버튼 이미지'
          cssOption='w-[30px] h-[30px] flex-shrink-0'
        />
        <H1
          cssOption='font-bold text-[1.6vw] truncate dark:text-white flex-1 cursor-pointer'
          content='WatchDucks'
        />
        <DarkModeButton isDark={isDark} toggleDarkMode={toggleDarkMode} />
      </div>
    </div>
  );
}
