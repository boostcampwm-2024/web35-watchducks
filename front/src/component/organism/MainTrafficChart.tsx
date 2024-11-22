import { LineChart } from '@chart/LineChart';
import DataLayout from '@component/template/DataLayout';
import useTop5Traffic from '@hook/api/useTop5Traffic';

type Props = {
  generation: string;
};

export default function MainTrafficChart({ generation }: Props) {
  const { data } = useTop5Traffic(generation);

  const series = data.map((item) => ({
    name: item.name,
    data: item.traffic.map((traffic) => ({
      x: new Date(traffic[0]),
      y: Number(traffic[1])
    }))
  }));
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
      <div className='m-16'>
        <h2 className='text-navy text-center text-2xl font-bold'>TOP5 DAILY TRAFFIC</h2>
      </div>
      <div className='w-full flex-1'>
        <LineChart options={options} series={series} />
      </div>
    </DataLayout>
  );
}
