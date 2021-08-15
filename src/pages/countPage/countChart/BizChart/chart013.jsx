import React from 'react';
import ReactDOM from 'react-dom';
import { GroupedBarChart } from 'bizcharts';

// 数据源
const data = [
  {
    label: 'Mon.',
    type: 'series1',
    value: 2800,
  },
  {
    label: 'Mon.',
    type: 'series2',
    value: 2260,
  },
  {
    label: 'Tues.',
    type: 'series1',
    value: 1800,
  },
  {
    label: 'Tues.',
    type: 'series2',
    value: 1300,
  },
  {
    label: 'Wed.',
    type: 'series1',
    value: 950,
  },
  {
    label: 'Wed.',
    type: 'series2',
    value: 900,
  },
  {
    label: 'Thur.',
    type: 'series1',
    value: 500,
  },
  {
    label: 'Thur.',
    type: 'series2',
    value: 390,
  },
  {
    label: 'Fri.',
    type: 'series1',
    value: 170,
  },
  {
    label: 'Fri.',
    type: 'series2',
    value: 100,
  },
];

export default function Demo() {
  return (
    <GroupedBarChart
      data={data}
      title={{
        visible: true,
        text: '分组条形图',
      }}
      xField='value'
      yField='label'
      seriesField='type'
			isGroup={true}
      color={['#1383ab', '#c52125']}
      label={{
        formatter: (v) => `${v.value}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      }}
      />
  );
}
