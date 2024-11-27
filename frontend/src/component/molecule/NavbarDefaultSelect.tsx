import { BOOST_CAMP_OPTION } from '@constant/NavbarSelect';
import { NavbarSelectProps } from '@type/Navbar';

import NavbarSelect from './NavbarSelect';

type Props = NavbarSelectProps;

export default function NavbarDefaultSelect(props: Props) {
  return <NavbarSelect {...props} groupOption={BOOST_CAMP_OPTION} />;
}
