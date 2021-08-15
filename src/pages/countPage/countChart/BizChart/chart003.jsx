/**彩色柱状图 */
import React from 'react';
import {
  Chart,
  Interval,
  Tooltip,
} from 'bizcharts';
const data = [
  { year: '1951 年', sales: 38 },
  { year: '1952 年', sales: 52 },
  { year: '1956 年', sales: 61 },
  { year: '1957 年', sales: 45 },
  { year: '1958 年', sales: 48 },
  { year: '1959 年', sales: 38 },
  { year: '1960 年', sales: 38 },
  { year: '1962 年', sales: 38 },
];
const scale = {
  sales: {
    min: 0,
  },
};

export default function IndexPage() {
  return (
      <Chart
        scale={scale}
        autoFit
        data={data}
        interactions={['active-region']}
        appendPadding={[20, 0, 0, 0]}
      >
        <Interval position="year*sales" color="year" />
        <Tooltip shared />
      </Chart>
  );
}


