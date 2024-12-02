import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import RankingList from '@component/organism/RankingList';
import useNavbarStore from '@store/NavbarStore';

export default function RankingPage() {
  const { generation } = useNavbarStore();

  return (
    <div className='flex h-screen w-full flex-col gap-8 bg-lightgray p-16 dark:bg-lightblack'>
      <CustomErrorBoundary>
        <RankingList generation={generation} />
      </CustomErrorBoundary>
    </div>
  );
}
