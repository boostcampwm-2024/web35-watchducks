import DataLayout from '@component/template/DataLayout';
import useProjectDAU from '@hook/api/useProjectDAU';
import { ResponsiveTimeRange } from '@nivo/calendar';
import { validateDAU } from '@util/Validate';

type Props = {
  id: string;
};

export default function ProjectDAU({ id }: Props) {
  const { data } = useProjectDAU(id);
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const series = data.dauRecords
    .filter(({ date }) => new Date(date) >= thirtyDaysAgo)
    .map(({ date, dau }) => ({
      day: date,
      value: dau
    }));

  if (validateDAU(data)) {
    return (
      <DataLayout cssOption='flex flex-col items-center justify-center p-[8px] rounded-lg shadow-md w-full bg-white h-full'>
        <div className='mb-[8px] text-center'>
          <h2 className='text-navy text-2xl font-bold'>DAU</h2>
        </div>
        <div className='text-gray-500 flex w-full flex-1 items-center justify-center text-center'>
          No DAU data available
        </div>
      </DataLayout>
    );
  }

  return (
    <DataLayout cssOption='flex flex-col items-center justify-center p-[8px] rounded-lg shadow-md w-full bg-white h-full'>
      <div className='mb-[8px] text-center'>
        <h2 className='text-navy text-[1.5vw] font-bold'>DAU</h2>
      </div>
      <div className='flex h-[90%] w-[100%] items-center overflow-hidden px-[40px]'>
        <ResponsiveTimeRange
          data={series}
          from={thirtyDaysAgo}
          to={today}
          colors={['#ebedf0', '#40c463', '#30a14e', '#216e39']}
          dayBorderWidth={2}
          dayBorderColor='#ffffff'
          weekdayTicks={[]}
          margin={{
            top: 20,
            right: 0,
            bottom: 100,
            left: 0
          }}
          tooltip={({ day, value }) => (
            <div
              style={{
                padding: '8px',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                color: 'gray',
                pointerEvents: 'none'
              }}>
              {new Date(day).toLocaleDateString('ko-KR')}: {value.toLocaleString()}명
            </div>
          )}
          theme={{
            labels: {
              text: {
                fill: '#9CA3AF'
              }
            }
          }}
        />
      </div>
    </DataLayout>
  );
}
