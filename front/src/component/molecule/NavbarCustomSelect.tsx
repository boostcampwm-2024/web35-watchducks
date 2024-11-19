import useGroupNames from '@hook/api/useGroupNames';
import { NavbarSelectProps } from '@type/Navbar';
import { useEffect } from 'react';

import NavbarSelect from './NavbarSelect';

type Props = NavbarSelectProps;

export default function NavbarCustomSelect(props: Props) {
  const { data = [] } = useGroupNames(props.generation);

  useEffect(() => {
    props.setSelectedGroup(data[0].value);
  }, [data]);

  return <NavbarSelect {...props} groupOption={data} />;
}
