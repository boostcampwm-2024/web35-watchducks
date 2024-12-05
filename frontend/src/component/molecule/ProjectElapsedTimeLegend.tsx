import H2 from '@component/atom/H2';
import Span from '@component/atom/Span';
import { RESPONSE_TIME_LEGENDS } from '@constant/Chart';

type Props = {
  averageTime: number;
};

export default function ProjectElapsedTimeLegend({ averageTime }: Props) {
  const getColorByTime = (time: number) => {
    if (time <= 200) return '#4ADE80';
    if (time <= 1000) return '#FFA500';
    return '#FF4444';
  };

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <div className='text-center'>
        <H2
          cssOption='text-navy mb-2 text-[0.9vw] font-bold'
          content='TOP3 Average Response Speed'
        />
        <div className='text-[1.5vw] font-bold' style={{ color: getColorByTime(averageTime) }}>
          {averageTime || 0}ms
        </div>
      </div>
      <div className='flex items-center justify-center gap-4'>
        {RESPONSE_TIME_LEGENDS.map((item, index) => (
          <div key={index} className='flex items-center gap-2'>
            <Span cssOption='h-2 w-2 rounded-full block' style={{ backgroundColor: item.color }} />
            <Span
              cssOption='text-gray-500 text-[0.7vw]'
              content={`${item.range} ${item.description}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
