# 여기는 📊chart 디렉토리입니다

공통으로 차트들을 모아놓은 디렉토리 입니다.
option을 다르게해, Chart컴포넌트를 호출하는식으로 사용합니다.

구현방법

```ts
export default function BarChart({ series, options: additionalOptions }: Props) {
	const barChartOptions: ApexCharts.ApexOptions = {
		chart: {
		height: '100%',
		type: 'bar'
		},
	};
	const options = merge({}, barChartOptions, additionalOptions);
	return <Chart type='bar' series={series} options={options} />;
};
```

- 차트종류에 맞게 파스칼케이스로 함수명을 짓습니다.
- series는 차트에 표시할 데이터입니다.
- options은 차트의 옵션입니다.
- 차트의 옵션은 차트종류에 맞게 기본옵션을 정의하고, 추가옵션을 받아서 merge를 통해 합쳐서 사용합니다.
- Chart컴포넌트를 호출할때 type, series, options를 넘겨줍니다.
