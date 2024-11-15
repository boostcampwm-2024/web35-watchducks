import Img from '@component/atom/Img';
import P from '@component/atom/P';
import Span from '@component/atom/Span';
import { MEDALS } from '@constant/Medals';
import useRankings from '@hook/useRankings';
import { Ranking } from '@type/Navbar';
import { Fragment } from 'react';

export default function NavbarRanking() {
  const { data = [] } = useRankings();

  const renderRankingItem = (item: Ranking, index: number) => {
    const rank = index;

    return (
      <Fragment key={item.host}>
        <div className='group flex items-center justify-between gap-2 py-2 font-light hover:cursor-pointer'>
          <div className='flex items-center gap-2'>
            {rank <= 2 ? (
              <Fragment>
                <Img src={MEDALS[rank as keyof typeof MEDALS].image} cssOption='flex-shrink-0' />
                <P
                  cssOption={`truncate ${MEDALS[rank as keyof typeof MEDALS].color}`}
                  content={item.host}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Span cssOption='w-6 flex-shrink-0 font-medium' content={`${rank + 1}th`} />
                <P cssOption='truncate' content={item.host} />
              </Fragment>
            )}
          </div>
          <div className='flex min-w-0 items-center text-right'>
            <Span
              cssOption='text-[clamp(12px,1.5vw,14px)] group-hover:hidden'
              content={item.count}
            />
            <Span cssOption='hidden font-medium group-hover:block' content='&gt;' />
          </div>
        </div>
        <hr className='border-gray-300' />
      </Fragment>
    );
  };

  return (
    <div className='mt-8 rounded-10 border-1.5 border-solid border-gray p-4'>
      <P cssOption='text-12 mb-1 font-bold' content='TRAFFIC RANKING' />
      {data.map((item, index) => renderRankingItem(item, index))}
    </div>
  );
}
