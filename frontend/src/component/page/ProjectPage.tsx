import Loading from '@component/atom/Loading';
import useGroupNames from '@hook/api/useGroupNames';
import { Navigate } from 'react-router-dom';

export default function ProjectPage() {
  const { data, isLoading } = useGroupNames('9');
  if (isLoading) {
    return <Loading />;
  }

  if (!data?.length) {
    return <Navigate to='/404' />;
  }

  return <Navigate to={`/project/${data[0].value}`} />;
}
