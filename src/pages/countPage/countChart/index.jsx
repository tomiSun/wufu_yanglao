import React, { useEffect, useState } from 'react';
import CustomBlockChart from './CustomBlockChart';
import { cssTempPageData, demoData } from './temData';
import './index.less';
//  let data = demoData
let data = cssTempPageData
export default function IndexPage(props) {
  return (
    <div className="box1">
      {data.map(item => {
        return <CustomBlockChart
          data={item['tempData']}
          height={item["config"]['height']}
          mode={item["config"]['mode']} />
      })}
    </div>

  );
}