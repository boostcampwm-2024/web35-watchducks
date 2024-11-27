import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import ProjectDAU from '@component/organism/ProjectDAU';
import ProjectElapsedTime from '@component/organism/ProjectElapsedTime';
import ProjectSuccessRate from '@component/organism/ProjectSuccessRate';
import ProjectTrafficChart from '@component/organism/ProjectTrafficChart';
import useIsExistGroup from '@hook/api/useIsExistGroup';
import { Navigate, useParams } from 'react-router-dom';

export default function ProjectDetailPage() {
  const { id } = useParams();

  if (id === undefined) {
    return <Navigate to='/404' />;
  }

  const { data, isLoading } = useIsExistGroup(id);
  if (isLoading) {
    return;
  }
  if (data?.exists === false) {
    return <Navigate to='/404' />;
  }

  return (
    <div className='flex h-screen w-full flex-col bg-lightgray p-8 dark:bg-lightblack'>
      <div className='flex h-1/2 gap-8'>
        <div className='h-full w-1/3'>
          <CustomErrorBoundary>
            <ProjectElapsedTime id={id} />
          </CustomErrorBoundary>
        </div>
        <div className='h-full w-1/3'>
          <CustomErrorBoundary>
            <ProjectSuccessRate id={id} />
          </CustomErrorBoundary>
        </div>
        <div className='h-full w-1/3'>
          <CustomErrorBoundary>
            <ProjectDAU id={id} />
          </CustomErrorBoundary>
        </div>
      </div>

      <div className='mt-8 h-1/2'>
        <CustomErrorBoundary>
          <ProjectTrafficChart id={id} />
        </CustomErrorBoundary>
      </div>
    </div>
  );
}
