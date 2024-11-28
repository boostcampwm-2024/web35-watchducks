import { RANK_OPTIONS } from '@constant/Rank';
import { RankType } from '@type/Rank';

type Props = {
  rankType: string;
  setRankType: (type: RankType) => void;
};

export default function RankingTab({ rankType, setRankType }: Props) {
  return (
    <div className='border-gray-200 flex border-b'>
      {RANK_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-2 ${option.value === rankType ? 'border-blue-500 text-blue-500 border-b-2' : 'text-gray hover:text-black'}`}
          onClick={() => setRankType(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
