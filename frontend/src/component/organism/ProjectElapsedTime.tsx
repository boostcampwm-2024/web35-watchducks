import PolarAreaChart from '@chart/PolarAreaChart';
import ProjectElapsedTimeLegend from '@component/molecule/ProjectElapsedTimeLegend';
import DataLayout from '@component/template/DataLayout';
import useProjectElapsedTime from '@hook/api/useProjectElapsedTime';

type Props = {
  id: string;
};

export default function ProjectElapsedTime({ id }: Props) {
  const { data } = useProjectElapsedTime(id);

  if (!data?.fastestPaths?.length || !data?.slowestPaths?.length) {
    return (
      <DataLayout cssOption='flex flex-col p-[8px] rounded-lg shadow-md w-full h-full'>
        <div className='mb-[8px] text-center'>
          <h2 className='text-navy text-2xl font-bold'>Response Speed</h2>
        </div>
        <div className='text-gray-500 flex w-full flex-1 items-center justify-center text-center'>
          No response time data available
        </div>
      </DataLayout>
    );
  }

  const getAverageResponseTime = () => {
    return Number(
      (
        data.fastestPaths.reduce((acc, cur) => acc + cur.avgResponseTime, 0) /
        data.fastestPaths.length
      ).toFixed(0)
    );
  };

  const createChartOptions = (color: string): ApexCharts.ApexOptions => ({
    colors: [color],
    tooltip: {
      custom: function ({ seriesIndex, w }) {
        const path = w.config.labels[seriesIndex];
        const value = w.config.series[seriesIndex];
        const type = color === '#4ADE80' ? 'Fastest' : 'Slowest';

        return `
          <div style="
            padding: 8px;
            font-size: 12px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            border-radius: 3px;
          ">
            <div style="margin-bottom: 4px;">
              <span style="color: ${color};">● </span>
              <span style="font-weight: bold;">${type}</span>
            </div>
            <div style="margin-bottom: 4px;">${path}</div>
            <div style="font-weight: bold;">${value.toLocaleString()}ms</div>
          </div>
        `;
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    fill: {
      opacity: 0.8
    },
    legend: {
      show: false
    },
    yaxis: {
      labels: {
        style: {
          colors: '#D1D5DB'
        }
      }
    }
  });

  const fastestOptions = createChartOptions('#4ADE80');
  const slowestOptions = createChartOptions('#FF4444');

  return (
    <DataLayout cssOption='flex flex-col p-[8px] rounded-lg shadow-md w-full h-full'>
      <div className='flex h-full flex-col'>
        <div className='mb-4'>
          <h2 className='text-navy text-center text-[1.5vw] font-bold'>Response Speed</h2>
        </div>
        <div className='grid min-h-0 flex-1 grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <h3 className='mb-2 text-center text-[1vw] font-semibold text-green'>Fastest Paths</h3>
            <div className='min-h-0 flex-1'>
              <PolarAreaChart
                options={{
                  ...fastestOptions,
                  labels: data.fastestPaths.map((item) => item.path)
                }}
                series={data.fastestPaths.map((item) => item.avgResponseTime)}
              />
            </div>
          </div>
          <div className='flex flex-col'>
            <h3 className='mb-2 text-center text-[1vw] font-semibold text-red'>Slowest Paths</h3>
            <div className='min-h-0 flex-1'>
              <PolarAreaChart
                options={{
                  ...slowestOptions,
                  labels: data.slowestPaths.map((item) => item.path)
                }}
                series={data.slowestPaths.map((item) => item.avgResponseTime)}
              />
            </div>
          </div>
        </div>
        <div className='mt-auto pt-4'>
          <ProjectElapsedTimeLegend averageTime={getAverageResponseTime()} />
        </div>
      </div>
    </DataLayout>
  );
}
