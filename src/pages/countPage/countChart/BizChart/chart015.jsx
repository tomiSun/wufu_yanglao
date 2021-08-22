import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DonutChart } from 'bizcharts';

// 数据源

export default function Demo(props) {
  const { programId, chartData } = props
  if (chartData.length == 0) {
    return <>暂无数据</>
  }
  let initData = chartData[programId]
  let title = programId == "0009" ? "入院人数来源统计" : "出院人数流向统计"
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
