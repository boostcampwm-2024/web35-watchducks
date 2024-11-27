import { merge } from 'lodash-es';

import { Chart } from './Chart';

type Props = {
  series: number[];
  options: ApexCharts.ApexOptions;
};

export default function PolarAreaChart({ series, options: additionalOptions }: Props) {
  console.log(series);
  const PolarChartOption: ApexCharts.ApexOptions = {
    chart: {
      type: 'polarArea',
      height: 350
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor: '#e8e8e8'
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: '#e8e8e8'
        }
      }
    }
  };

  const options = merge({}, PolarChartOption, additionalOptions);
  return <Chart type='polarArea' series={series} options={options} />;
}
