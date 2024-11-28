import Img from '@component/atom/Img';
import P from '@component/atom/P';
import Span from '@component/atom/Span';
import { MEDALS } from '@constant/Medals';
import useRankings from '@hook/api/useRankings';
import { Ranking } from '@type/api';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  generation: string;
};

export default function NavbarRanking({ generation }: Props) {
  const navigate = useNavigate();
  const { data = [] } = useRankings(generation);

  const handleClick = (host: string) => {
    navigate(`/project/${host}`);
  };

  const renderRankingItem = (item: Ranking, index: number) => {
    const rank = index;

    return (
      <Fragment key={item.host}>
        <div
          className='group flex items-center justify-between gap-2 py-2 font-light hover:cursor-pointer'
          onClick={() => handleClick(item.host)}>
          <div className='flex min-w-0 flex-1 items-center gap-2'>
            {rank <= 2 ? (
              <Fragment>
                <Img
                  src={MEDALS[rank as keyof typeof MEDALS].image}
                  cssOption='flex-shrink-0 w-5'
                />
                <P
                  cssOption={`truncate ${MEDALS[rank as keyof typeof MEDALS].color} max-w-[140px] text-[clamp(12px,1.5vw,14px)]`}
                  content={item.host}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Span
                  cssOption='w-6 flex-shrink-0 font-medium dark:text-white'
                  content={`${rank + 1}th`}
                />
                <P cssOption='truncate dark:text-white max-w-[140px]' content={item.host} />
              </Fragment>
            )}
          </div>
          <div className='flex items-center text-right'>
            <Span
              cssOption='text-[clamp(12px,1.5vw,14px)] group-hover:hidden dark:text-white'
              content={item.count.toString()}
            />
            <Span cssOption='hidden font-medium group-hover:block dark:text-white' content='&gt;' />
          </div>
        </div>
        <hr className='border-zinc-300' />
      </Fragment>
    );
  };

  return (
    <div className='mt-8 rounded-10 border-1.5 border-solid border-gray p-4'>
      <P cssOption='text-12 mb-1 font-bold dark:text-white' content='TRAFFIC RANKING' />
      {data.map((item, index) => renderRankingItem(item, index))}
    </div>
  );
}
