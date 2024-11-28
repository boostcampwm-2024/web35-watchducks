import { CHART_COLORS } from '@constant/Chart';
import { merge } from 'lodash-es';

import { Chart } from './Chart';

type Props = {
  series: number[];
  options: ApexCharts.ApexOptions;
};

export default function PieChart({ series, options: additionalOptions }: Props) {
  const donutChartOption: ApexCharts.ApexOptions = {
    chart: {
      height: 300,
      type: 'donut'
    },
    legend: {
      position: 'bottom'
    },
    colors: CHART_COLORS
  };

  const options = merge({}, donutChartOption, additionalOptions);
  return <Chart type='donut' series={series} options={options} />;
}
