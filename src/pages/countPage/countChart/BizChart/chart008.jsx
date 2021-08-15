import React from 'react';
import ReactDOM from 'react-dom';
import { StackedColumnChart } from 'bizcharts';

// 数据源
const data = [
  {
    year: '1991',
    value: 3,
    type: 'Lon',
  },
  {
    year: '1992',
    value: 4,
    type: 'Lon',
  },
  {
    year: '1993',
    value: 3.5,
    type: 'Lon',
  },
  {
    year: '1994',
    value: 5,
    type: 'Lon',
  },
  {
    year: '1995',
    value: 4.9,
    type: 'Lon',
  },
  {
    year: '1996',
    value: 6,
    type: 'Lon',
  },
  {
    year: '1997',
    value: 7,
    type: 'Lon',
  },
  {
    year: '1998',
    value: 9,
    type: 'Lon',
  },
  {
    year: '1999',
    value: 13,
    type: 'Lon',
  },
  {
    year: '1991',
    value: 3,
    type: 'Bor',
  },
  {
    year: '1992',
    value: 4,
    type: 'Bor',
  },
  {
    year: '1993',
    value: 3.5,
    type: 'Bor',
  },
  {
    year: '1994',
    value: 5,
    type: 'Bor',
  },
  {
    year: '1995',
    value: 4.9,
    type: 'Bor',
  },
  {
    year: '1996',
    value: 6,
    type: 'Bor',
  },
  {
    year: '1997',
    value: 7,
    type: 'Bor',
  },
  {
    year: '1998',
    value: 9,
    type: 'Bor',
  },
  {
    year: '1999',
    value: 13,
    type: 'Bor',
  },
];

export default function Demo() {
  return (
    <StackedColumnChart
      data={data}
      title={{
        visible: true,
        text: '堆叠柱状图',
      }}
      autoFit
      padding='auto'
      xField='year'
      yField='value'
      yAxis={{
        min: 0,
      }}
      color={['#ae331b', '#1a6179']}
      stackField='type'
    />
  );
}
