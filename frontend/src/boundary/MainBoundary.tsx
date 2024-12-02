import NavbarLayout from '@component/template/NabvarLayout';
import useNavbarStore from '@store/NavbarStore';
import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

export default function MainBoundary() {
  const { isNavbarOpen } = useNavbarStore();
  const location = useLocation();
  const hideNavbarPaths = ['/register', '*', '/404'];
  const showNavbar = !hideNavbarPaths.some((path) => location.pathname === path);

  return (
    <div className='bg-gray-50 flex min-h-screen'>
      {showNavbar && <NavbarLayout />}
      <motion.main
        animate={{
          width: showNavbar && isNavbarOpen ? 'calc(100% - 300px)' : '100%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='flex-1'>
        <Outlet />
      </motion.main>
    </div>
  );
}
