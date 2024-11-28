import FaviconImg from '@asset/image/Favicon.svg';
import Img from '@component/atom/Img';
import useDarkMode from '@hook/useDarkMode';
import { motion } from 'framer-motion';
import { TargetAndTransition } from 'framer-motion';

type Props = {
  animate?: TargetAndTransition;
};

export default function DarkModeButton({ animate }: Props) {
  const [isDark, toggleDarkMode] = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className='pointer-events-auto absolute flex h-[30px] w-[30px] items-center justify-center rounded-full hover:scale-110'
      animate={animate}>
      <Img
        src={FaviconImg}
        cssOption={`${isDark ? 'text-white' : 'text-black'}`}
        alt='다크모드 버튼 이미지'
      />
    </motion.button>
  );
}
