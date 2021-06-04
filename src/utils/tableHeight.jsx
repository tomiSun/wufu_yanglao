import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
// 获取表格高度
export const getRectDom = (tableRef) => {
  let windowHeight = window.innerHeight;
  let tableHeight = 0;
  // let tableHeight = windowHeight - 140;
  let tableScroll = tableHeight - 36;
  // console.log('tableRef.current: ', tableRef.current);
  if (tableRef.current) {
    let rect = ReactDOM.findDOMNode(tableRef.current).getBoundingClientRect();
    let { top } = rect;
    // 56:分页高度  36：表头高度
    tableHeight = windowHeight - top - 56;
    tableScroll = tableHeight - 36;
    // console.log('tableHeight: ', tableHeight);
    return { tableHeight, tableScroll };
  }
};
// 自定义hooks获取table高度
export const useTableHeight = (tableRef) => {
  const [tableHeight, setTableHeight] = useState('');
  const getTableHeight = () => {
    const { tableHeight, tableScroll } = getRectDom(tableRef);
    setTableHeight(tableHeight);
  };
  const onResize = useCallback(() => {
    getTableHeight();
  }, []);
  useEffect(() => {
    getTableHeight();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return tableHeight;
};
