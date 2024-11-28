import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import MainData from '@component/organism/MainData';
import MainResponse from '@component/organism/MainResponse';
import MainTrafficChart from '@component/organism/MainTrafficChart';
import { useNavContext } from '@hook/useNavContext';

type Props = {
  generation: string;
};

export default function MainPage() {
  const { generation } = useNavContext<Props>();

  return (
    <div className='flex h-screen w-full flex-col gap-8 bg-lightgray p-8 dark:bg-lightblack'>
      <div className='mt-8 grid h-1/2 grid-cols-1 gap-8 lg:grid-cols-2'>
        <CustomErrorBoundary>
          <MainData generation={generation} />
        </CustomErrorBoundary>
        <CustomErrorBoundary>
          <MainResponse generation={generation} />
        </CustomErrorBoundary>
      </div>

      <div className='min-h-0 flex-1'>
        <CustomErrorBoundary>
          <MainTrafficChart generation={generation} />
        </CustomErrorBoundary>
      </div>
    </div>
  );
}
