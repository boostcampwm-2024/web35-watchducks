import { merge } from 'lodash-es';

import { Chart } from './Chart';

type Props = {
  series: ApexAxisChartSeries;
  options: ApexCharts.ApexOptions;
};

export function LineChart({ series, options: additionalOptions }: Props) {
  const lineChartOption: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 350
    },
    colors: ['#FF6B6B', '#FF9F43', '#FECA57', '#4ECB71', '#4B7BEC'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM',
          day: 'dd',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return (val / 1000000).toFixed(0);
        }
      }
    },
    legend: {
      labels: {
        colors: '#64748B'
      }
    }
  };

  const options = merge(lineChartOption, additionalOptions);

  return <Chart type='area' series={series} options={options} />;
}
