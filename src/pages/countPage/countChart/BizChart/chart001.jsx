/**柱状图 */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Chart, Interval } from 'bizcharts';

// 数据源
const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];
export default function IndexPage(props) {
  return (
    <Chart autoFit data={data}>
      <Interval position="genre*sold" />
    </Chart>
  );
}
