/*密度热力图 */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DensityHeatmapChart } from 'bizcharts';

export default function Demo() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('https://alifd.alibabausercontent.com/materials/@bizcharts/heatmap-image/0.3.0/mock.json')
      .then(res => res.json())
      .then(data => {
        setData(data);
      })
  }, [])
  
  return (
    <DensityHeatmapChart
      data={data}
      title={{
        visible: true,
        text: '密度热力图',
      }}
      autoFit
      padding="auto"
      xField='g'
      yField='l'
      colorField='tmp'
      color={['#295599', '#3e94c0', '#78c6d0', '#b4d9e4', '#fffef0', '#f9cdac', '#ec7d92', '#bc448c']}
      radius={15}
      intensity={2}
      
    />
  );
}
