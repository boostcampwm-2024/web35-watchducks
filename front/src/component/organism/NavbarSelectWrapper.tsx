import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import DarkModeButton from '@component/molecule/DarkModeButton';
import NavbarCustomSelect from '@component/molecule/NavbarCustomSelect';
import NavbarDefaultSelect from '@component/molecule/NavbarDefaultSelect';
import { PATH } from '@constant/Path';
import { useDuckAnimation } from '@hook/useDarkModeAnimation';
import { NavbarSelectProps } from '@type/Navbar';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';

type Props = NavbarSelectProps;

export default function NavbarSelectWrapper(props: Props) {
  const { pathname } = useLocation();
  const isProjectPath = pathname === PATH.PROJECT;
  const containerRef = useRef<HTMLDivElement>(null);
  const duckAnimation = useDuckAnimation({ containerRef });

  return (
    <div className='relative mt-8 w-full'>
      <div ref={containerRef}>
        {!isProjectPath ? (
          <NavbarDefaultSelect {...props} />
        ) : (
          <CustomErrorBoundary>
            <NavbarCustomSelect {...props} />
          </CustomErrorBoundary>
        )}
      </div>
      <div className='pointer-events-none absolute left-0 top-0 h-full w-full'>
        <DarkModeButton animate={duckAnimation} />
      </div>
    </div>
  );
}
