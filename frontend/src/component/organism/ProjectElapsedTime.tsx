import PolarAreaChart from '@chart/PolarAreaChart';
import ProjectElapsedTimeLegend from '@component/molecule/ProjectElapsedTimeLegend';
import DataLayout from '@component/template/DataLayout';
import useProjectElapsedTime from '@hook/api/useProjectElapsedTime';

type Props = {
  id: string;
};

export default function ProjectElapsedTime({ id }: Props) {
  const { data } = useProjectElapsedTime(id);

  if (!data?.fastestPaths?.length && !data?.slowestPaths?.length) {
    return (
      <DataLayout cssOption='flex flex-col p-8 rounded-lg shadow-md w-full h-full'>
        <div className='mb-8 text-center'>
          <h2 className='text-navy text-2xl font-bold'>Response Speed</h2>
        </div>
        <div className='text-gray-500 flex w-full flex-1 items-center justify-center text-center'>
          No response time data available
        </div>
      </DataLayout>
    );
  }

  const fastestPaths = data.fastestPaths;
  const slowestPaths = data.slowestPaths;
  const allPaths = [...fastestPaths, ...slowestPaths];
  const pathNames = allPaths.map((item) => item.path);
  const series = allPaths.map((item) => item.avgResponseTime);

  const getAverageResponseTime = () => {
    return Number(
      (
        fastestPaths.reduce((acc, cur) => acc + cur.avgResponseTime, 0) / fastestPaths.length
      ).toFixed(0)
    );
  };

  const getLabelType = (index: number) => {
    if (index < fastestPaths.length) return 'Fastest';
    return 'Slowest';
  };

  const options: ApexCharts.ApexOptions = {
    colors: [
      ...Array(fastestPaths.length).fill('#4ADE80'),
      ...Array(slowestPaths.length).fill('#FF4444')
    ],
    labels: pathNames,
    tooltip: {
      custom: function ({ seriesIndex }) {
        const path = pathNames[seriesIndex];
        const value = series[seriesIndex];
        const type = getLabelType(seriesIndex);
        const color = seriesIndex < fastestPaths.length ? '#4ADE80' : '#FF4444';

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
    }
  };

  return (
    <DataLayout cssOption='flex flex-col p-8 rounded-lg shadow-md w-full h-full'>
      <div className='flex h-full flex-col'>
        <div className='mb-4'>
          <h2 className='text-navy text-center text-2xl font-bold'>Response Speed</h2>
        </div>
        <div className='min-h-0 flex-1'>
          <PolarAreaChart options={options} series={series} />
        </div>
        <div className='mt-auto pt-4'>
          <ProjectElapsedTimeLegend averageTime={getAverageResponseTime()} />
        </div>
      </div>
    </DataLayout>
  );
}
