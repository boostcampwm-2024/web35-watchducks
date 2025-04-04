import PieChart from '@chart/PieChart';
import DataLayout from '@component/template/DataLayout';
import { SUCCESS_FAIL_COLORS } from '@constant/Chart';
import useProjectSuccessRate from '@hook/api/useProjectSuccessRate';

type Props = {
  id: string;
};

export default function ProjectSuccessRate({ id }: Props) {
  const { data } = useProjectSuccessRate(id);

  console.log(data);
  const successRate = Math.floor(data.success_rate);
  const failRate = 100 - Math.floor(data.success_rate);

  const series = [successRate, failRate];

  const options: ApexCharts.ApexOptions = {
    colors: SUCCESS_FAIL_COLORS,
    labels: ['Success %', 'Fail %'],
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Success',
              color: '#94A3B8',
              formatter: function () {
                return successRate.toFixed(0) + '%';
              }
            },
            value: {
              color: '#94A3B8'
            }
          }
        }
      }
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex }) {
        const label = seriesIndex === 0 ? 'success_rate' : 'fail_rate';
        const value = seriesIndex === 0 ? successRate : failRate;
        return (
          '<div class="custom-tooltip" style="padding: 8px;">' +
          '<span style="color: ' +
          SUCCESS_FAIL_COLORS[seriesIndex] +
          ';">●</span> ' +
          `<span style="color: white;">${label}: ${value}%</span>` +
          '</div>'
        );
      }
    }
  };

  return (
    <DataLayout cssOption='flex flex-col p-[8px] rounded-lg shadow-md w-full h-full'>
      <div className='mb-[8px] text-center'>
        <h2 className='text-navy text-[1.5vw] font-bold'>Request Success Rate</h2>
      </div>
      <div className='w-full flex-1'>
        <PieChart options={options} series={series} />
      </div>
    </DataLayout>
  );
}
