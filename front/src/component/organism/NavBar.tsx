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
    <aside className='bg-lightblue dark:bg-darkblue flex h-screen flex-col px-24'>
      <div className='flex flex-col gap-16 pt-24'>
        <NavbarTitle />
        <NavbarSelectWrapper {...props} />
        <NavbarMenu />
        <CustomErrorBoundary>
          <NavbarRanking generation={props.generation} />
        </CustomErrorBoundary>
        <NavigateButton
          path='/register'
          content='프로젝트 등록하러가기'
          cssOption='flex items-center mt-24 whitespace-nowrap rounded-10 bg-blue p-16 text-10 text-white hover:text-black md:text-12'
        />
      </div>
      <div className='mt-auto pb-24'>
        <NavbarContact />
      </div>
    </aside>
  );
}
