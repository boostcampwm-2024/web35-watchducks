import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import RankingList from '@component/organism/RankingList';

export default function RankingPage() {
  return (
    <div className='flex h-screen w-full flex-col gap-[8px] p-[16px]'>
      <CustomErrorBoundary>
        <RankingList />
      </CustomErrorBoundary>
    </div>
  );
}
