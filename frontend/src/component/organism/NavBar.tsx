import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarContact from '@component/molecule/NavbarContact';
import NavbarMenu from '@component/molecule/NavbarMenu';
import NavbarRanking from '@component/molecule/NavbarRanking';
import NavbarTitle from '@component/molecule/NavbarTitle';
import NavigateButton from '@component/molecule/NavigateButton';
import NavbarSelectWrapper from '@component/organism/NavbarSelectWrapper';

export default function Navbar() {
  return (
    <aside className='flex h-screen flex-col bg-lightblue px-24 dark:bg-darkblue'>
      <div className='flex flex-col gap-16 pt-24'>
        <NavbarTitle />
        <NavbarSelectWrapper />
        <NavbarMenu />
        <CustomErrorBoundary>
          <NavbarRanking />
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
