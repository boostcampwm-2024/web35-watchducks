import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarContact from '@component/molecule/NavbarContact';
import NavbarMenu from '@component/molecule/NavbarMenu';
import NavbarRanking from '@component/molecule/NavbarRanking';
import NavbarTitle from '@component/molecule/NavbarTitle';
import NavigateButton from '@component/molecule/NavigateButton';
import NavbarSelectWrapper from '@component/organism/NavbarSelectWrapper';

export default function Navbar() {
  return (
    <aside className='border-3 flex h-screen min-h-0 flex-col rounded-[11px] bg-lightblue p-4 dark:bg-darkblue'>
      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='flex min-h-0 flex-1 flex-col justify-between'>
          <div className='flex min-h-0 flex-col space-y-4'>
            <div className='flex-shrink-0 space-y-2'>
              <NavbarTitle />
              <NavbarSelectWrapper />
            </div>
            <div className='flex-shrink-0'>
              <NavbarMenu />
            </div>
            <div className='min-h-0 flex-1 overflow-y-scroll'>
              <CustomErrorBoundary>
                <NavbarRanking />
              </CustomErrorBoundary>
            </div>
            <div className='flex-shrink-0'>
              <NavigateButton
                path='/register'
                content='프로젝트 등록하러가기'
                cssOption='text-center whitespace-nowrap rounded-[10px] bg-blue p-3 text-[0.8vw] text-white hover:text-black w-full'
              />
            </div>
          </div>

          <div className='flex-shrink-0 pt-4'>
            <NavbarContact />
          </div>
        </div>
      </div>
    </aside>
  );
}
