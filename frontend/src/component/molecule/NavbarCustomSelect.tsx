import NavbarSelect from '@component/molecule/NavbarSelect';
import useGroupNames from '@hook/api/useGroupNames';
import useNavbarStore from '@store/NavbarStore';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavbarCustomSelect() {
  const { generation, setSelectedGroup } = useNavbarStore();
  const { data = [] } = useGroupNames(generation);
  const location = useLocation();
  const prevProjectGroupRef = useRef<string | null>(null);
  const projectGroup = location.pathname.split('/project/')[1];

  useEffect(() => {
    if (data.length > 0 && projectGroup !== prevProjectGroupRef.current) {
      const groupToSelect =
        projectGroup && data.some((item) => item.value === projectGroup)
          ? projectGroup
          : data[0].value;

      setSelectedGroup(groupToSelect);
      prevProjectGroupRef.current = projectGroup;
    }
  }, [data, setSelectedGroup, projectGroup]);

  return <NavbarSelect groupOption={data} />;
}
