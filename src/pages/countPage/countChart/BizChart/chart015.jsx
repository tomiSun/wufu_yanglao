import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DonutChart } from 'bizcharts';

// 数据源
const d0009 = [
  {
    type: '来源于社会人数',
    value: 127,
  },
  {
    type: '来源于医院人数',
    value: 25,
  }
];
const d0010 = [
  {
    type: '流向社会人数',
    value: 125,
  },
  {
    type: '流向医院部人数',
    value: 37,
  },
];
export default function Demo(props) {
  const { programId } = props
  let initData = programId == "0009" ? d0009 : d0010
  let title = programId == "0009" ? "入院人数细分统计" : "出院人数细分统计"
  const [data, setData] = useState(initData)
  return (
    <DonutChart
      data={data}
      title={{
        visible: true,
      }}
      autoFit
      height={350}
      description={{
        visible: true,
      }}
      radius={0.8}
      padding='auto'
      angleField='value'
      colorField='type'
      statistic={{
        title: {
          customHtml: () => title
        }
      }}
    />
  );
}
