import { CHART_COLORS } from '@constant/ChartColors';
import { TIME_OFFSET } from '@constant/Time';
import { formatKoreanDate, formatKoreanTime } from '@util/FormatTime';
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
      fillSeriesColor: false,
      marker: {
        show: true
      },
      x: {
        show: true,
        format: 'yyyy-MM-dd HH:mm',
        formatter: function (val) {
          const utcDate = new Date(val);
          const koreanDate = new Date(utcDate.getTime() + TIME_OFFSET);
          return formatKoreanDate(koreanDate);
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
        const koreanDate = new Date(utcDate.getTime() + TIME_OFFSET);
        const seriesName = w.globals.seriesNames[seriesIndex];
        const color = w.globals.colors[seriesIndex];

        return (
          '<div class="custom-tooltip" style="padding: 8px;">' +
          `<div style="color: ${color}; margin-bottom: 4px;">${seriesName}</div>` +
          `<div style="color: #666;">Time: ${formatKoreanDate(koreanDate)}</div>` +
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
      tickAmount: 12,
      labels: {
        formatter: function (value: string, timestamp: number) {
          if (!timestamp) return value;
          const date = new Date(timestamp);
          const koreanDate = new Date(date.getTime() + TIME_OFFSET);
          return formatKoreanTime(koreanDate);
        },
        rotateAlways: false,
        hideOverlappingLabels: true
      }
    }
  };

  const options = merge({}, lineChartOption, additionalOptions);
  return <Chart type='area' series={series} options={options} />;
}
