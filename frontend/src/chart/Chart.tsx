import { useDefaultOptions } from '@hook/useDefaultOption';
import { ApexOptions } from 'apexcharts';
import { merge } from 'lodash-es';
import { lazy, Suspense } from 'react';

const ReactApexChart = lazy(() => import('react-apexcharts'));

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
    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading chart...</div>}>
      <ReactApexChart type={type} series={series} options={options} width='100%' height='100%' />
    </Suspense>
  );
}
