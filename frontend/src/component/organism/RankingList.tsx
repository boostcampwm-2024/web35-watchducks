import RankingItem from '@component/molecule/RankingItem';
import RankingTab from '@component/molecule/RankingTab';
import DataLayout from '@component/template/DataLayout';
import useRankData from '@hook/api/useRankData';
import useNavbarStore from '@store/NavbarStore';
import { RankType } from '@type/Rank';
import { useState } from 'react';

export default function RankingList() {
  const [rankType, setRankType] = useState<RankType>({ name: 'traffic', unit: '개' });
  const { generation } = useNavbarStore();
  const { data } = useRankData(rankType.name, generation);

  return (
    <DataLayout cssOption='p-[8px] rounded-lg shadow-md w-full justify-center flex-col flex h-full'>
      <div className='flex h-full w-full flex-col'>
        <div className='mb-[16px] ml-[8px]'>
          <RankingTab rankName={rankType.name} setRankType={setRankType} />
        </div>
        <div className='flex h-full justify-center'>
          <RankingItem data={data} unit={rankType.unit} />
        </div>
      </div>
    </DataLayout>
  );
}
