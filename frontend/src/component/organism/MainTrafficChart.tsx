import LineChart from '@chart/LineChart';
import DataLayout from '@component/template/DataLayout';
import { DAY_TO_MS_SECOND } from '@constant/Date';
import useTop5Traffic from '@hook/api/useTop5Traffic';
import { fillEmptySlots } from '@util/Time';
import { useMemo } from 'react';

type Props = {
  generation: string;
};

export default function MainTrafficChart({ generation }: Props) {
  const { data } = useTop5Traffic(generation);

  const series = useMemo(() => {
    return data.trafficCharts.map((chart) => ({
      name: chart.name || 'Unknown',
      data: fillEmptySlots(chart.traffic).map(([timestamp, value]) => ({
        x: new Date(timestamp),
        y: Number(value)
      }))
    }));
  }, [data]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      events: {
        beforeZoom: (ctx, { xaxis }) => {
          const timeRange = xaxis.max - xaxis.min;
          const ONE_DAY = DAY_TO_MS_SECOND;
          if (timeRange > ONE_DAY) {
            return {
              xaxis: {
                min: ctx.w.globals.minX,
                max: ctx.w.globals.maxX
              }
            };
          }

          return {
            xaxis: {
              min: xaxis.min,
              max: xaxis.max
            }
          };
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        },
        datetimeFormatter: {
          hour: 'HH:mm'
        }
      },
      tickAmount: 24,
      tooltip: {
        enabled: false,
        formatter: (val: string) => {
          return new Date(val).toLocaleTimeString();
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: false
      },
      title: {
        text: 'Traffic Count',
        style: {
          color: '#64748B',
          fontSize: '12px'
        }
      },
      min: 0
    }
  };

  return (
    <DataLayout cssOption='flex flex-col p-[8px] rounded-lg shadow-md w-full h-full'>
      <div className='m-[16px]'>
        <h2 className='text-navy text-center text-2xl font-bold'>TOP5 DAILY TRAFFIC</h2>
      </div>
      <div className='w-full flex-1'>
        <LineChart options={options} series={series} />
      </div>
    </DataLayout>
  );
}
