import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarCustomSelect from '@component/molecule/NavbarCustomSelect';
import NavbarDefaultSelect from '@component/molecule/NavbarDefaultSelect';
import { PATH } from '@constant/Path';
import { NavbarSelectProps } from '@type/Navbar';
import { useLocation } from 'react-router-dom';

type Props = NavbarSelectProps;

export default function NavbarSelectWrapper(props: Props) {
  const { pathname } = useLocation();
  const isProjectPath = pathname === PATH.PROJECT;

  if (!isProjectPath) {
    return <NavbarDefaultSelect {...props} />;
  }

  return (
    <CustomErrorBoundary>
      <NavbarCustomSelect {...props} />
    </CustomErrorBoundary>
  );
}
