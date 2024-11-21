import TextMotionDiv from '@component/atom/TextMotionDiv';
import DataLayout from '@component/template/DataLayout';
import useTotalDatas from '@hook/api/useTotalDatas';

type Props = {
  generation: string;
};

export default function MainData({ generation }: Props) {
  const {
    totalProjectCount,
    totalResponseRate,
    totalTraffic,
    dailyDifferenceTraffic,
    elapsedTime
  } = useTotalDatas(generation);

  const isTrafficIncrease = !dailyDifferenceTraffic.startsWith('-');

  const arrowStyle = isTrafficIncrease
    ? { symbol: '▲', color: 'text-green' }
    : { symbol: '▼', color: 'text-red' };

  return (
    <DataLayout cssOption='p-8 rounded-lg shadow-md w-full justify-center flex-col flex'>
      <h2 className='text-navy mb-8 text-center text-2xl font-bold'>9기 Total Data</h2>

      <div className='mt-4 grid grid-cols-2 place-items-center gap-10'>
        <div className='flex flex-col items-center text-center'>
          <TextMotionDiv
            content={`${totalProjectCount}개`}
            cssOption='text-navy text-2xl font-bold'
          />
          <p className='mt-2 text-sm text-gray-500'>등록된 프로젝트 수</p>
        </div>

        <div className='flex flex-col items-center text-center'>
          <TextMotionDiv
            content={`${(totalTraffic / 1000000).toFixed(1)}M`}
            cssOption='text-navy text-2xl font-bold'
          />
          <p className='mt-2 text-sm text-gray-500'>총 트래픽</p>
        </div>

        <div className='flex flex-col items-center text-center'>
          <TextMotionDiv
            content={elapsedTime?.toFixed(0) + 'ms'}
            cssOption='text-navy text-2xl font-bold'
          />
          <p className='mt-2 text-sm text-gray-500'>평균 응답시간</p>
        </div>

        <div className='flex flex-col items-center text-center'>
          <TextMotionDiv
            content={`+${Math.trunc(totalResponseRate)}%`}
            cssOption='text-navy text-2xl font-bold'
          />
          <p className='mt-2 text-sm text-gray-500'>트래픽 응답 성공률</p>
        </div>
      </div>

      <div className='mt-6 flex justify-center'>
        <div className='flex items-center gap-2'>
          <span className={`text-sm ${arrowStyle.color}`}>{arrowStyle.symbol}</span>
          <TextMotionDiv
            content={dailyDifferenceTraffic}
            cssOption={`text-sm font-bold ${arrowStyle.color}`}
          />
          <span className='text-sm'>전월 대비 트래픽 증가량</span>
        </div>
      </div>
    </DataLayout>
  );
}
