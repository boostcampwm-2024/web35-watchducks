import Navbar from '@component/organism/NavBar';
import useNavbarStore from '@store/NavbarStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavbarLayout() {
  const { isNavbarOpen, toggleNavbar } = useNavbarStore();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const location = useLocation();

  const hideNavbarPaths = ['/register', '*', '/404'];

  if (hideNavbarPaths.some((path) => location.pathname === path)) {
    return null;
  }

  return (
    <div
      className='relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <AnimatePresence>
        {isNavbarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: '300px', opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='border-gray-200 border-r'>
            <Navbar />
            {isHovered && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => toggleNavbar()}
                className='hover:bg-gray-50 absolute right-[-20px] top-1/3 z-10 rounded-full bg-white p-2 shadow-md'
                style={{ transform: 'translateY(-50%)' }}>
                <ChevronLeft size={20} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isNavbarOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => toggleNavbar()}
          className='hover:bg-gray-50 fixed left-4 top-1/3 z-10 rounded-full bg-white p-2 shadow-md'
          style={{ transform: 'translateY(-50%)' }}>
          <ChevronRight size={20} />
        </motion.button>
      )}
    </div>
  );
}
