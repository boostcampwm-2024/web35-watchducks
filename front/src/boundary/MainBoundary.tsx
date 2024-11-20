import Navbar from '@component/organism/NavBar';
import { BOOST_CAMP_OPTION, GENERATION_VALUE } from '@constant/NavbarSelect';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function MainBoundary() {
  const [generation, setGeneration] = useState<string>(GENERATION_VALUE.NINTH);
  const [selectedGroup, setSelectedGroup] = useState<string>(BOOST_CAMP_OPTION[0].value);
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className='flex min-h-screen bg-gray-50'>
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
              className='border-r border-gray-200'>
              <Navbar
                generation={generation}
                selectedGroup={selectedGroup}
                setGeneration={setGeneration}
                setSelectedGroup={setSelectedGroup}
              />
              {isHovered && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsNavbarOpen(false)}
                  className='absolute right-[-20px] top-1/3 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-50'
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
            onClick={() => setIsNavbarOpen(true)}
            className='fixed left-4 top-1/3 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-50'
            style={{ transform: 'translateY(-50%)' }}>
            <ChevronRight size={20} />
          </motion.button>
        )}
      </div>

      <motion.main
        animate={{
          width: isNavbarOpen ? 'calc(100% - 300px)' : '100%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='flex-1'>
        <Outlet context={{ generation }} />
      </motion.main>
    </div>
  );
}
