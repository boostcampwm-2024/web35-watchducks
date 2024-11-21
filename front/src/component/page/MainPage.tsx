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
    <div className='bg-lightgray dark:bg-lightblack flex h-screen w-full flex-col gap-8 p-8'>
      <div className='grid h-1/2 grid-cols-1 gap-8 lg:grid-cols-2'>
        <CustomErrorBoundary>
          <MainData generation={generation} />
        </CustomErrorBoundary>
        <CustomErrorBoundary>
          <MainResponse generation={generation} />
        </CustomErrorBoundary>
      </div>

      <div className='h-2/3 flex-1'>
        <CustomErrorBoundary>
          <MainTrafficChart />
        </CustomErrorBoundary>
      </div>
    </div>
  );
}
