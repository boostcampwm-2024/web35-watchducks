import FaviconImg from '@asset/image/Favicon.svg';
import Img from '@component/atom/Img';
import NavigateButton from '@component/molecule/NavigateButton';
import { motion } from 'framer-motion';

export default function ErrorPage() {
  const raindrops = Array.from({ length: 30 }, (_, i) => i);

  const getRandomX = () => Math.random() * 300 - 100;

  return (
    <div className='bg-gray-50 relative flex h-screen w-full items-center justify-center overflow-hidden'>
      {raindrops.map((i) => (
        <motion.div
          key={i}
          initial={{
            x: getRandomX(),
            y: -20,
            opacity: 1,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.8
          }}
          animate={{
            y: '100vh',
            rotate: 360,
            opacity: [1, 0.8, 0.6, 0.4, 0.2]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 3
          }}
          className='absolute top-0 h-6 w-6'>
          <Img src={FaviconImg} cssOption='w-full h-full' alt='부덕이 이미지' />
        </motion.div>
      ))}

      <div className='z-10 flex flex-col gap-4 text-center'>
        <h1 className='text-6xl font-bold text-yellow-300'>404</h1>
        <p className='text-xl text-blue'>Page Not Found</p>
        <NavigateButton
          path='/'
          content='Go To Main'
          cssOption='text-white bg-blue px-8 py-3 rounded-md hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg font-semibold mt-4 hover:text-black'
        />
      </div>
    </div>
  );
}
