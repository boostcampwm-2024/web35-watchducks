import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarCustomSelect from '@component/molecule/NavbarCustomSelect';
import NavbarDefaultSelect from '@component/molecule/NavbarDefaultSelect';
import { PATH } from '@constant/Path';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavbarSelectWrapper() {
  const { pathname } = useLocation();
  const isProjectPath = pathname.includes(PATH.PROJECT);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className='relative mt-[8px] w-full'>
      <div ref={containerRef}>
        {!isProjectPath ? (
          <NavbarDefaultSelect />
        ) : (
          <CustomErrorBoundary>
            <NavbarCustomSelect />
          </CustomErrorBoundary>
        )}
      </div>
    </div>
  );
}
