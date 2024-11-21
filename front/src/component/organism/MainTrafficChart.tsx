import { LineChart } from '@chart/LineChart';
import DataLayout from '@component/template/DataLayout';

export default function MainTrafficChart() {
  const series = [
    {
      name: '프로젝트 A',
      data: [
        { x: '2024-03-01T13:30:30', y: 15000 },
        { x: '2024-03-02T13:30:30', y: 18500 },
        { x: '2024-03-03T14:31:30', y: 12300 },
        { x: '2024-03-04T14:32:30', y: 25000 },
        { x: '2024-03-04T14:33:30', y: 22000 },
        { x: '2024-03-04T14:34:30', y: 19500 },
        { x: '2024-03-04T14:35:30', y: 28000 }
      ]
    }
  ];
  const options: ApexCharts.ApexOptions = {
    xaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Traffic Count'
      }
    }
  };

  return (
    <DataLayout cssOption='flex flex-col p-8 rounded-lg shadow-md w-full min-h-[350px]'>
      <div className='mx-16 my-16'>
        <h2 className='text-navy text-center text-2xl font-bold'>TOP5 DAILY TRAFFIC</h2>
      </div>
      <div className='w-full flex-1'>
        <LineChart options={options} series={series} />
      </div>
    </DataLayout>
  );
}
