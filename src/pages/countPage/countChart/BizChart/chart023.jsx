/**气泡图 */
import React, { useEffect, useState } from 'react';
const mapTitle = {
  '0001': '原有人数',
  '0002': '入院人数',
  '0003': '出院人数',
  '0004': '留院人数',
  '0005': '实际占用床位数',
  '0006': '完全失能老人数',
  '0007': '部分失能人数',
  '0008': '自理老人人数',
  '0011': '代配药人数',
};
export default function Demo(props) {
  const { programId, chartData } = props;
  const [title, setTitle] = useState(mapTitle[programId] || '-');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <div>
        <h2>{title}</h2>
      </div>
      <div>
        <h1 style={{ color: '#e66060' }}>{`${chartData[programId] || '-'}人`}</h1>
      </div>
    </div>
  );
}
