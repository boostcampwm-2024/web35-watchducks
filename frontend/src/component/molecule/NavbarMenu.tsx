import H1 from '@component/atom/H1';
import Img from '@component/atom/Img';
import P from '@component/atom/P';
import { MENU_ITEMS } from '@constant/NavbarMenu';
import { MenuItem } from '@type/Navbar';
import { Link, useLocation } from 'react-router-dom';

export default function NavbarMenu() {
  const { pathname } = useLocation();

  function MenuItem({ item, isActive }: { item: MenuItem; isActive: boolean }) {
    return (
      <Link to={item.path}>
        <div
          className={`flex cursor-pointer items-center gap-4 md:gap-[8px] ${
            isActive
              ? 'dark:text-white dark:hover:text-white'
              : 'text-gray hover:text-black dark:hover:text-white'
          }`}>
          <Img
            src={isActive ? item.activeIcon : item.inactiveIcon}
            alt={`${item.label} 아이콘`}
            cssOption='w-4 md:w-6'
          />
          <P content={item.label} cssOption='text-[1vw] trunacte' />
        </div>
      </Link>
    );
  }

  return (
    <div className='flex flex-col gap-[8px] md:gap-[16px]'>
      <H1
        cssOption='mt-[8px] text-[14px] md:text-16 whitespace-nowrap dark:text-white'
        content='MENU'
      />
      {MENU_ITEMS.map((item) => (
        <MenuItem
          key={item.path}
          item={item}
          isActive={item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)}
        />
      ))}
    </div>
  );
}
