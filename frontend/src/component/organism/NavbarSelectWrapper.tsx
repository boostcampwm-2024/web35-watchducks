import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import DarkModeButton from '@component/molecule/DarkModeButton';
import NavbarCustomSelect from '@component/molecule/NavbarCustomSelect';
import NavbarDefaultSelect from '@component/molecule/NavbarDefaultSelect';
import { PATH } from '@constant/Path';
import { useDuckAnimation } from '@hook/useDarkModeAnimation';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavbarSelectWrapper() {
  const { pathname } = useLocation();
  const isProjectPath = pathname.includes(PATH.PROJECT);
  const containerRef = useRef<HTMLDivElement>(null);
  const duckAnimation = useDuckAnimation({ containerRef });

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
      <div className='pointer-events-none absolute left-0 top-0 h-full w-full'>
        <DarkModeButton animate={duckAnimation} />
      </div>
    </div>
  );
}
