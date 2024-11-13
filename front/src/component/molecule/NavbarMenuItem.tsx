import Img from '@component/atom/Img';
import P from '@component/atom/P';
import { MenuItem } from '@type/Navbar';
import { Link } from 'react-router-dom';

type Props = {
  item: MenuItem;
  isActive: boolean;
};

export default function NavbarMenuItem({ item, isActive }: Props) {
  return (
    <Link to={item.path}>
      <div
        className={`flex cursor-pointer items-center gap-4 md:gap-8 ${
          isActive ? 'text-black' : 'text-gray hover:text-black'
        }`}>
        <Img
          src={isActive ? item.activeIcon : item.inactiveIcon}
          alt='메뉴제목 텍스트'
          cssOption='w-4 md:w-6'
        />
        <P content={item.label} cssOption='text-12 md:text-14 whitespace-nowrap' />
      </div>
    </Link>
  );
}
