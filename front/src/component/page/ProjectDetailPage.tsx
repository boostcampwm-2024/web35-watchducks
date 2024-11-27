import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import ProjectDAU from '@component/organism/ProjectDAU';
import ProjectElapsedTime from '@component/organism/ProjectElapsedTime';
import ProjectSuccessRate from '@component/organism/ProjectSuccessRate';
import useIsExistGroup from '@hook/api/useIsExistGroup';
import { Navigate, useParams } from 'react-router-dom';

export default function ProjectDetailPage() {
  const { id } = useParams();

  if (id === undefined) {
    return <Navigate to='/404' />;
  }

  const { data, isLoading } = useIsExistGroup(id);
  if (isLoading) {
    return null;
  }
  if (data?.exists === false) {
    return <Navigate to='/404' />;
  }

  return (
    <div className='flex h-screen w-full flex-col gap-8 bg-lightgray p-8 dark:bg-lightblack'>
      <div className='mt-8 grid max-h-[400px] grid-cols-1 gap-8 lg:grid-cols-3'>
        <CustomErrorBoundary>
          <ProjectElapsedTime id={id} />
        </CustomErrorBoundary>
        <CustomErrorBoundary>
          <ProjectSuccessRate id={id} />
        </CustomErrorBoundary>
        <CustomErrorBoundary>
          <ProjectDAU id={id} />
        </CustomErrorBoundary>
      </div>

      <div className='min-h-0 flex-1'>
        <CustomErrorBoundary>
          <div>ProjectDetailPage</div>
        </CustomErrorBoundary>
      </div>
    </div>
  );
}
