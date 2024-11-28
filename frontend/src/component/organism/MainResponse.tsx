import BarChart from '@chart/BarChart';
import DataLayout from '@component/template/DataLayout';
import { CHART_COLORS } from '@constant/Chart';
import useTop5ResponseTime from '@hook/api/useTop5ResponseTime';

type Props = {
  generation: string;
};

export default function MainResponse({ generation }: Props) {
  const { data } = useTop5ResponseTime(generation);

  const series = [
    {
      data: data.map((item) => Number(item.avgResponseTime.toFixed(1)))
    }
  ];

  const categories = data.map((item) => item.projectName).map((projectName) => [projectName]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    colors: CHART_COLORS,
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const color = CHART_COLORS[dataPointIndex];
        return (
          '<div class="custom-tooltip" style="padding: 8px;">' +
          '<span style="color: ' +
          color +
          ';">●</span> ' +
          '<span style="color: #000000;">' +
          data[dataPointIndex].projectName +
          ': ' +
          series[seriesIndex][dataPointIndex] +
          'ms</span>' +
          '</div>'
        );
      }
    }
  };

  return (
    <DataLayout cssOption='flex flex-col p-8 rounded-lg shadow-md w-full'>
      <div className='mb-8 text-center'>
        <h2 className='text-navy text-2xl font-bold'>TOP5 Response Speed</h2>
      </div>
      <div className='w-full flex-1'>
        <BarChart options={options} series={series} />
      </div>
    </DataLayout>
  );
}
