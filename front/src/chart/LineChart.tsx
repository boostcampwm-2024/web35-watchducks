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
      height: 350,
      toolbar: {
        show: true
      }
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
      enabled: true,
      shared: true,
      intersect: false,
      followCursor: true,
      x: {
        format: 'yyyy-MM-dd HH:mm',
        formatter: function (val) {
          const utcDate = new Date(val);
          const koreaDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
          return koreaDate.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      },
      y: [
        {
          formatter: function (val) {
            return val.toFixed(1);
          }
        },
        {
          formatter: function (val) {
            return val.toFixed(1);
          }
        }
      ],
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const utcDate = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
        const koreaDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
        const seriesName = w.globals.seriesNames[seriesIndex];
        const color = w.globals.colors[seriesIndex];

        return (
          '<div class="custom-tooltip" style="padding: 8px;">' +
          `<div style="color: ${color}; margin-bottom: 4px;">${seriesName}</div>` +
          `<div style="color: #666;">Time: ${koreaDate.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}</div>` +
          `<div style="color: #000; font-weight: bold;">Traffic: ${value.toFixed(1)}</div>` +
          '</div>'
        );
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (value: string, timestamp: number) {
          if (!timestamp) return value;
          const date = new Date(timestamp);
          const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
          return koreaDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        }
      }
    },
    legend: {
      labels: {
        colors: '#64748B'
      }
    },
    markers: {
      hover: {
        sizeOffset: 0
      }
    }
  };

  const options = merge(lineChartOption, additionalOptions);
  return <Chart type='area' series={series} options={options} />;
}
