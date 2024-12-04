import Img from '@component/atom/Img';
import P from '@component/atom/P';
import { MEDALS } from '@constant/Medals';
import { RankingData } from '@type/api';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  data: RankingData;
  unit: string;
};

export default function RankingItem({ data, unit }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.rank.length / itemsPerPage);

  const getPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.rank.slice(startIndex, endIndex);
  };

  const renderRankingItem = (item: { projectName: string; value: number }, index: number) => {
    const absoluteIndex = index + (currentPage - 1) * 10;

    return absoluteIndex <= 2 ? (
      <div
        className='flex w-full justify-between rounded-[4px] bg-[#3692EF]/[0.2] p-[8px] text-black dark:text-white'
        key={item.projectName}>
        <div className='flex items-center gap-4'>
          <div className='flex gap-4'>
            <Img
              src={MEDALS[absoluteIndex as keyof typeof MEDALS].image}
              cssOption='flex-shrink-0 w-5'
            />
            <P content={Number(absoluteIndex + 1).toString()} />
          </div>
        </div>
        <P
          cssOption={`truncate ${MEDALS[absoluteIndex as keyof typeof MEDALS].color} w-[140px] text-[clamp(12px,1.5vw,14px)] hover:scale-105 cursor-pointer`}
          content={item.projectName}
          onClick={() => navigate(`/project/${item.projectName}`)}
        />
        <P
          content={`${item.value.toLocaleString()} ${unit}`}
          cssOption='w-[140px] mr-[16px]16 text-right text-[clamp(12px,1.5vw,14px)]'
        />
      </div>
    ) : (
      <div
        className='flex w-full justify-between rounded-[4px] bg-[#3692EF]/[0.2] p-[8px] text-black dark:text-white'
        key={item.projectName}>
        <div className='flex items-center gap-4'>
          <div className='flex gap-4'>
            <P cssOption='flex-shrink-0 w-5' />
            <P content={`${absoluteIndex + 1}`} />
          </div>
        </div>
        <P
          cssOption={`truncate w-[140px] text-[clamp(12px,1.5vw,14px)] cursor-pointer hover:scale-105`}
          content={item.projectName}
          onClick={() => navigate(`/project/${item.projectName}`)}
        />
        <P
          content={`${item.value.toLocaleString()} ${unit}`}
          cssOption='w-[140px] mr-[16px]16 text-right text-[clamp(12px,1.5vw,14px)]'
        />
      </div>
    );
  };

  const renderPaginationButton = (pageNum: number) => (
    <button
      key={pageNum}
      onClick={() => setCurrentPage(pageNum)}
      className={`flex h-[8px] w-[8px] items-center justify-center rounded ${currentPage === pageNum ? 'text-dark dark:white' : 'text-gray hover:text-black dark:hover:text-white'} `}>
      {pageNum}
    </button>
  );

  return (
    <div className='flex w-full flex-col gap-[8px]'>
      {getPageItems().map((item, index) => renderRankingItem(item, index))}

      <div className='mt-4 flex items-center justify-center gap-2'>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className='hover:bg-gray-100 rounded p-2 disabled:opacity-50 disabled:hover:bg-transparent'>
          <ChevronLeft className='h-5 w-5 hover:text-blue dark:hover:text-black' />
        </button>

        <div className='flex gap-2'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(renderPaginationButton)}
        </div>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className='hover:bg-gray-100 rounded p-2 disabled:opacity-50 disabled:hover:bg-transparent'>
          <ChevronRight className='h-5 w-5 hover:text-blue dark:hover:text-black' />
        </button>
      </div>
    </div>
  );
}
