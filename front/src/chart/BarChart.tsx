import { merge } from 'lodash-es';

import { Chart } from './Chart';

type Props = {
  series: ApexAxisChartSeries;
  options: ApexCharts.ApexOptions;
};

export default function BarChart({ series, options: additionalOptions }: Props) {
  const barChartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: '100%',
      type: 'bar'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
        dataLabels: {
          position: 'bottom'
        },
        columnWidth: '100%',
        distributed: true
      }
    },
    fill: {
      type: 'gradient'
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        }
      }
    },
    legend: {
      labels: {
        colors: '#64748B'
      }
    },
    grid: {
      padding: {
        left: 10,
        right: 10
      }
    }
  };

  const options = merge({}, barChartOptions, additionalOptions);

  return <Chart type='bar' series={series} options={options} />;
}
