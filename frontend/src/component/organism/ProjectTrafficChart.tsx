import LineChart from '@chart/LineChart';
import Select from '@component/atom/Select';
import DataLayout from '@component/template/DataLayout';
import { DATE_OPTIONS } from '@constant/Date';
import useProjectTraffic from '@hook/api/useProjectTraffic';
import { DateType } from '@type/Date';
import { useState } from 'react';

type Props = {
  id: string;
};

export default function ProjectTrafficChart({ id }: Props) {
  const [dateType, setDateType] = useState<DateType>('day');
  const { data } = useProjectTraffic(id, dateType);
  console.log(data);

  const handleDateTypeChange = (type: DateType) => {
    setDateType(type);
  };

  const series = [
    {
      name: data.projectName || 'Unknown',
      data: data.trafficData.map((item) => ({
        x: new Date(item.timestamp),
        y: Number(item.count)
      }))
    }
  ];

  const getXAxisFormatter = (type: DateType) => {
    switch (type) {
      case 'day':
        return {
          formatter: function (value: string, timestamp: number) {
            if (!timestamp) return value;
            const date = new Date(timestamp);
            return date.toLocaleString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          },
          tickAmount: 24
        };
      case 'week':
        return {
          formatter: function (value: string, timestamp: number) {
            if (!timestamp) return value;
            const date = new Date(timestamp);
            return date.toLocaleString('ko-KR', {
              month: 'short',
              day: 'numeric',
              weekday: 'short'
            });
          },
          tickAmount: 7
        };
      case 'month':
        return {
          formatter: function (value: string, timestamp: number) {
            if (!timestamp) return value;
            const date = new Date(timestamp);
            return date.toLocaleString('ko-KR', {
              month: 'short',
              day: 'numeric'
            });
          },
          tickAmount: 31
        };
    }
  };

  const xAxisConfig = getXAxisFormatter(dateType);

  const options: ApexCharts.ApexOptions = {
    xaxis: {
      type: 'datetime',
      ...xAxisConfig,
      labels: {
        style: {
          colors: '#64748B',
          fontSize: '12px'
        },
        ...xAxisConfig,
        rotateAlways: false,
        hideOverlappingLabels: true
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    tooltip: {
      x: {
        formatter: function (val: number) {
          const date = new Date(val);
          switch (dateType) {
            case 'day':
              return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
            case 'week':
            case 'month':
              return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              });
          }
        }
      }
    }
  };

  if (data.trafficData.length === 0) {
    return (
      <DataLayout cssOption='flex flex-col p-[8px] rounded-lg shadow-md w-full h-full justify-center'>
        <span className='text-center'>No data availiable</span>
      </DataLayout>
    );
  }

  return (
    <DataLayout cssOption='flex flex-col p-[8px] rounded-lg shadow-md w-full h-full'>
      <div className='mb-[8px] flex items-center justify-between'>
        <div className='flex-1 items-center pl-12 pt-2 text-xl text-gray'>Total: {data.total}</div>
        <div className='text-navy items-center text-center text-xl'>
          <span className='mr-2 text-2xl font-bold'>{data.projectName}</span>
          Traffic Chart
        </div>
        <div className='flex flex-1 justify-end'>
          <Select
            cssOption='p-2 border rounded'
            options={DATE_OPTIONS}
            value={dateType}
            onChange={handleDateTypeChange}
          />
        </div>
      </div>
      <div className='w-full flex-1'>
        <LineChart options={options} series={series} />
      </div>
    </DataLayout>
  );
}
