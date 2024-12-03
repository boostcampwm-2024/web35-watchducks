import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarContact from '@component/molecule/NavbarContact';
import NavbarMenu from '@component/molecule/NavbarMenu';
import NavbarRanking from '@component/molecule/NavbarRanking';
import NavbarTitle from '@component/molecule/NavbarTitle';
import NavigateButton from '@component/molecule/NavigateButton';
import NavbarSelectWrapper from '@component/organism/NavbarSelectWrapper';

export default function Navbar() {
  return (
    <aside className='border-3 flex h-screen flex-col overflow-hidden rounded-[11px] bg-lightblue p-[24px] dark:bg-darkblue'>
      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='flex flex-col gap-[16px] overflow-auto pt-[24px]'>
          <NavbarTitle />
          <NavbarSelectWrapper />
          <NavbarMenu />
          <CustomErrorBoundary>
            <NavbarRanking />
          </CustomErrorBoundary>
          <NavigateButton
            path='/register'
            content='프로젝트 등록하러가기'
            cssOption='text-center mt-[24px] whitespace-nowrap rounded-[10px] bg-blue p-[16px] text-[10px] md:text-[12px] lg:text-[14px] text-white hover:text-black w-[100%]'
          />
        </div>
        <div className='mt-auto pb-[24px] pt-[12px]'>
          <NavbarContact />
        </div>
      </div>
    </aside>
  );
}
