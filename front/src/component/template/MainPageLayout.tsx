import NavbarLayout from '@component/template/NavbarLayout';
import { Outlet } from 'react-router-dom';

export default function MainPageLayout() {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='w-[20%] border-r border-gray-200'>
        <NavbarLayout />
      </div>
      <main className='w-[80%] flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
