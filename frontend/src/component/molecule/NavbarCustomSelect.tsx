import NavbarSelect from '@component/molecule/NavbarSelect';
import useGroupNames from '@hook/api/useGroupNames';
import { NavbarSelectProps } from '@type/Navbar';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type Props = NavbarSelectProps;

export default function NavbarCustomSelect(props: Props) {
  const { data = [] } = useGroupNames(props.generation);
  const location = useLocation();
  const projectGroup = location.pathname.split('/project/')[1];
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!initializedRef.current && data.length > 0) {
      const groupToSelect =
        projectGroup && data.some((g) => g.value === projectGroup) ? projectGroup : data[0]?.value;

      props.setSelectedGroup(groupToSelect);
      initializedRef.current = true;
    }
  }, [data, props.setSelectedGroup, projectGroup]);

  return <NavbarSelect {...props} groupOption={data} />;
}
