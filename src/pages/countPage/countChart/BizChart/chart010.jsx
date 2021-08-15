import React from 'react';
import ReactDOM from 'react-dom';
import { RangeColumnChart } from 'bizcharts';

// 数据源
const data = [
  { type: '分类一', values: [76, 100] },
  { type: '分类二', values: [56, 108] },
  { type: '分类三', values: [38, 129] },
  { type: '分类四', values: [58, 155] },
  { type: '分类五', values: [45, 120] },
  { type: '分类六', values: [23, 99] },
  { type: '分类七', values: [18, 56] },
  { type: '分类八', values: [18, 34] },
];

export default function Demo() {
  return (
    <RangeColumnChart
      data={data}
      title={{
        visible: true,
        text: '区间柱状图',
      }}
      xField='type'
      yField='values'
      color='l(90) 0:#3e5bdb 1:#b4d9e4'
      columnStyle={{
        fillOpacity: 0.8,
      }}
      label={{
        visible: true,
        topStyle: {
          fill: '#3e5bdb',
        },
        bottomStyle: {
          fill: '#b4d9e4',
        },
      }}
    />
  );
}
