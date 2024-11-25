import { merge } from 'lodash-es';

import { Chart } from './Chart';

type Props = {
  series: ApexAxisChartSeries;
  options: ApexCharts.ApexOptions;
};

export function LineChart({ series, options: additionalOptions }: Props) {
  const lineChartOption: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      toolbar: {
        show: true,
        tools: {
          selection: false
        }
      },
      selection: {
        enabled: false
      }
    },
    colors: ['#FF6B6B', '#FF9F43', '#FECA57', '#4ECB71', '#4B7BEC'],
    tooltip: {
      fillSeriesColor: false,
      marker: {
        show: true
      },
      x: {
        show: true,
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
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 1,
      strokeWidth: 0,
      hover: {
        size: 6,
        sizeOffset: 3
      }
    },
    dataLabels: {
      enabled: false
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none'
        }
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
  };

  const options = merge({}, lineChartOption, additionalOptions);
  return <Chart type='area' series={series} options={options} />;
}
