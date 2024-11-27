import Navbar from '@component/organism/NavBar';
import { BOOST_CAMP_OPTION, GENERATION_VALUE } from '@constant/NavbarSelect';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function MainBoundary() {
  const navigate = useNavigate();
  const [generation, setGeneration] = useState<string>(GENERATION_VALUE.NINTH);
  const [selectedGroup, setSelectedGroup] = useState<string>(BOOST_CAMP_OPTION[0].value);
  const [isNavbarOpen, setIsNavbarOpen] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleSelectGroup = (value: string) => {
    setSelectedGroup(value);
    navigate(`/project/${value}`);
  };

  return (
    <div className='bg-gray-50 flex min-h-screen'>
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
              <Navbar
                generation={generation}
                selectedGroup={selectedGroup}
                setGeneration={setGeneration}
                setSelectedGroup={handleSelectGroup}
              />
              {isHovered && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsNavbarOpen(false)}
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
            onClick={() => setIsNavbarOpen(true)}
            className='hover:bg-gray-50 fixed left-4 top-1/3 z-10 rounded-full bg-white p-2 shadow-md'
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
