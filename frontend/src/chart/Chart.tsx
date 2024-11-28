import { useDefaultOptions } from '@hook/useDefaultOption';
import { ApexOptions } from 'apexcharts';
import { merge } from 'lodash-es';
import ReactApexChart from 'react-apexcharts';

type ApexChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'treemap'
  | 'boxPlot'
  | 'candlestick'
  | 'radar'
  | 'polarArea'
  | 'rangeBar';

type Props = {
  type: ApexChartType;
  series: ApexOptions['series'];
  options: ApexCharts.ApexOptions;
};

export function Chart({ type, options: chartOptions, series }: Props) {
  const { defaultOptions } = useDefaultOptions();

  const options = merge({}, defaultOptions, chartOptions);

  return (
    <ReactApexChart type={type} series={series} options={options} width='100%' height='100%' />
  );
}
