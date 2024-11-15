import H1 from '@component/atom/H1';
import NavbarMenuItem from '@component/molecule/NavbarMenuItem';
import { MENU_ITEMS } from '@constant/NavbarMenu';
import { useLocation } from 'react-router-dom';

export default function NavbarMenu() {
  const { pathname } = useLocation();

  return (
    <div className='flex flex-col gap-8 md:gap-16'>
      <H1 cssOption='mt-8 text-14 md:text-16 whitespace-nowrap' content='MENU' />
      {MENU_ITEMS.map((item) => (
        <NavbarMenuItem key={item.path} item={item} isActive={pathname === item.path} />
      ))}
    </div>
  );
}
