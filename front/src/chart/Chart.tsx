import { useDefaultOptions } from '@hook/useDefaultOption';
import { ApexOptions } from 'apexcharts';
import { merge, cloneDeep } from 'lodash-es';
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

  const clonedDefaults = cloneDeep(defaultOptions);
  const clonedChartOptions = cloneDeep(chartOptions);

  const options = merge(clonedDefaults, clonedChartOptions);

  return (
    <ReactApexChart
      type={type}
      series={cloneDeep(series)}
      options={options}
      width='100%'
      height='100%'
    />
  );
}
