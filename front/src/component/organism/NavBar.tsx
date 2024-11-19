import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarContact from '@component/molecule/NavbarContact';
import NavbarMenu from '@component/molecule/NavbarMenu';
import NavbarRanking from '@component/molecule/NavbarRanking';
import NavbarTitle from '@component/molecule/NavbarTitle';
import NavigateButton from '@component/molecule/NavigateButton';
import NavbarSelectWrapper from '@component/organism/NavbarSelectWrapper';
import { NavbarSelectProps } from '@type/Navbar';

type Props = NavbarSelectProps;

export default function Navbar(props: Props) {
  return (
    <aside className='flex h-screen flex-col gap-16 bg-white px-24 pt-24'>
      <NavbarTitle />
      <NavbarSelectWrapper {...props} />
      <NavbarMenu />
      <CustomErrorBoundary>
        <NavbarRanking />
      </CustomErrorBoundary>
      <NavigateButton
        path='/register'
        content='프로젝트 등록하러가기'
        cssOption='bg-blue rounded-10 text-white text-10 md:text-12 p-16 flex items-center whitespace-nowrap hover:text-black'
      />
      <NavbarContact />
    </aside>
  );
}
