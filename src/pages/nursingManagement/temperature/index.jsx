/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable } from 'yunyi-component';
import {
  Form,
  Modal,
  Input,
  Row,
  Col,
  Radio,
  InputNumber,
  message,
  Button,
  Divider,
  DatePicker,
  Checkbox,
  Select,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import {
  leaveManagementAdd,
  leaveManagementDel,
  leaveManagementSelect,
  leaveManagementUpdate,
} from '@/services/nursingManagement/leaveManagement';
import { patientQuery } from '@/services/inHospitalRegister';
import { baseArchiveQuery } from '@/services/archives';
import { findValByKey, getDefaultOption } from '@/utils/common';
import { config } from '@/utils/const';
const { pageSize, pageNum } = config;
import { useTableHeight } from '@/utils/tableHeight';
const { TextArea } = Input;
import moment from 'moment';
import { Temperature } from './components/temperatureChart/temperature';
import './styles/app.less';
import printHtml from '@/utils/print.js';
import { printStyle } from './printStyle';
import ReactDOM from 'react-dom';
import { useReactToPrint } from 'react-to-print';
export default () => {
  const TemperatureRef = useRef();
  // const print = () => {
  //   const dom = ReactDOM.findDOMNode(TemperatureRef.current).innerHTML;
  //   let printDom = dom;
  //   console.log('printDom: ', printDom);
  //   printHtml(printDom, printStyle);
  // };
  const print = useReactToPrint({
    content: () => TemperatureRef.current,
    pageStyle: printStyle,
  });

  // 初始化
  useEffect(() => {}, []);
  return (
    <div className="temperature">
      <Temperature data={{}} ref={TemperatureRef} />
      <Button type={'primary'} onClick={print}>
        打印
      </Button>
    </div>
  );
};
