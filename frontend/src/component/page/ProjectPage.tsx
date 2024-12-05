import Loading from '@component/atom/Loading';
import useGroupNames from '@hook/api/useGroupNames';
import useNavbarStore from '@store/NavbarStore';
import { Navigate } from 'react-router-dom';

export default function ProjectPage() {
  const { generation } = useNavbarStore();

  const { data, isLoading } = useGroupNames(generation);
  if (isLoading) {
    return <Loading />;
  }

  if (!data?.length) {
    return <Navigate to='/404' />;
  }

  return <Navigate to={`/project/${data[0].value}`} />;
}
