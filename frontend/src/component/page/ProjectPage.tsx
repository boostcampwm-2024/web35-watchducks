import Loading from '@component/atom/Loading';
import useGroupNames from '@hook/api/useGroupNames';
import { useNavContext } from '@hook/useNavContext';
import { Navigate } from 'react-router-dom';

type Props = {
  generation: string;
};

export default function ProjectPage() {
  const { generation } = useNavContext<Props>();

  const { data, isLoading } = useGroupNames(generation);
  if (isLoading) {
    return <Loading />;
  }

  if (!data?.length) {
    return <Navigate to='/404' />;
  }

  return <Navigate to={`/project/${data[0].value}`} />;
}
