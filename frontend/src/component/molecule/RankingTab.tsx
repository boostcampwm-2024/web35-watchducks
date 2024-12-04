import InformationButton from '@component/molecule/InformationButton';
import { RANK_OPTIONS } from '@constant/Rank';
import { RankType } from '@type/Rank';

type Props = {
  rankName: string;
  setRankType: (type: RankType) => void;
};

export default function RankingTab({ rankName, setRankType }: Props) {
  return (
    <div className='border-gray-200 flex justify-between border-b'>
      <div>
        {RANK_OPTIONS.map((option) => (
          <button
            key={option.value.name}
            className={`px-4 py-2 ${option.value.name === rankName ? 'border-blue-500 text-blue-500 border-b-2' : 'text-gray hover:text-black dark:hover:text-white'}`}
            onClick={() => setRankType(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
      <div className='flex items-center justify-center px-4'>
        <InformationButton text='트래픽은 등록부터 어제까지, 나머지는 전날의 데이터만을 순위로 보여줍니다!' />
      </div>
    </div>
  );
}
