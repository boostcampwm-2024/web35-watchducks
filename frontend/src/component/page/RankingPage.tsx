import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import RankingList from '@component/organism/RankingList';
import { useNavContext } from '@hook/useNavContext';

type Props = {
  generation: string;
};

export default function RankingPage() {
  const { generation } = useNavContext<Props>();

  return (
    <div className='flex h-screen w-full flex-col gap-8 bg-lightgray p-16 dark:bg-lightblack'>
      <CustomErrorBoundary>
        <RankingList generation={generation} />
      </CustomErrorBoundary>
    </div>
  );
}
