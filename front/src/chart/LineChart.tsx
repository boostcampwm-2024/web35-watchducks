import { CHART_COLORS } from '@constant/ChartColors';
import { DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS } from '@constant/Time';
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
      },
      zoom: {
        enabled: true,
        type: 'x'
      }
    },
    colors: CHART_COLORS,
    tooltip: {
      shared: true,
      intersect: false,
      fillSeriesColor: false,
      marker: {
        show: true
      },
      x: {
        show: true,
        format: 'yyyy-MM-dd HH:mm',
        formatter: function (val) {
          const date = new Date(val);
          return '오전 ' + date.toLocaleString('ko-KR', TIME_FORMAT_OPTIONS);
        }
      },
      y: [
        {
          formatter: function (val) {
            return val.toFixed(1);
          }
        }
      ],
      custom: function ({ series, dataPointIndex, w }) {
        const date = new Date(w.globals.seriesX[0][dataPointIndex]);
        let tooltipContent =
          '<div class="custom-tooltip" style="padding: 8px;">' +
          `<div style="color: #666; margin-bottom: 8px;">Time: ${date.toLocaleString('ko-KR', DATE_FORMAT_OPTIONS)}</div>`;

        w.globals.seriesNames.forEach((name: string, index: number) => {
          const value = series[index][dataPointIndex];
          const color = w.globals.colors[index];
          tooltipContent +=
            `<div style="display: flex; align-items: center; margin-bottom: 4px;">` +
            `<div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; margin-right: 8px;"></div>` +
            `<div style="color: ${color};">${name}: </div>` +
            `<div style="color: #000; font-weight: bold; margin-left: 4px;">${value.toFixed(1)}</div>` +
            `</div>`;
        });

        tooltipContent += '</div>';
        return tooltipContent;
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
    xaxis: {
      type: 'datetime',
      tickAmount: 12,
      labels: {
        formatter: function (value: string, timestamp: number) {
          if (!timestamp) return value;
          const date = new Date(timestamp);
          return date.toLocaleString('ko-KR', TIME_FORMAT_OPTIONS);
        },
        rotateAlways: false,
        hideOverlappingLabels: true
      }
    }
  };

  const options = merge({}, lineChartOption, additionalOptions);
  return <Chart type='area' series={series} options={options} />;
}
