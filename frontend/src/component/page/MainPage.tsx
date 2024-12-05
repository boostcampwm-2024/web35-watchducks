import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import MainData from '@component/organism/MainData';
import MainResponse from '@component/organism/MainResponse';
import MainTrafficChart from '@component/organism/MainTrafficChart';
import useNavbarStore from '@store/NavbarStore';

export default function MainPage() {
  const generation = useNavbarStore((state) => state.generation);

  return (
    <div className='flex h-screen w-full flex-col gap-[8px] p-[8px]'>
      <div className='mt-[8px] grid h-1/2 grid-cols-1 gap-[8px] md:grid-cols-2'>
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
