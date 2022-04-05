/* eslint-disable no-param-reassign */
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
  message,
  DatePicker,
  TimePicker,
  Select,
  Tabs,
  Drawer,
  Divider,
} from 'antd';
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import { patientQuery } from '@/services/inHospitalRegister';
import { useTableHeight } from '@/utils/tableHeight';
import moment from 'moment';
import {
  batchQueryVitalSignRecord,
  batchUpdateVitalSignRecord,
  addVitalSignRecord,
  queryVitalSignRecord,
  queryThreeVolume,
} from '@/services/nursingManagement/threeVolumeList';
import { config } from '@/utils/const';
import { Temperature } from './components/temperatureChart/temperature';
import './styles/app.less';
import { printStyle } from './printStyle';
import { useReactToPrint } from 'react-to-print';
import { excelExport } from '@/utils/ExcelExport';
import { isOnePeople } from '@/utils/common';

const { pageSize } = config;
const { TabPane } = Tabs;
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  const [basic, setBasic] = useState({});
  // 上部搜索searchForm模块
  const [topFrom] = Form.useForm();
  const searchTopForm = {
    dateArr: [
      {
        label: '时间',
        name: 'recordTime',
        config: {
          time: moment(),
          showTime: false,
          allowClear: false,
          onChange: (e) => {
            topFrom.setFieldsValue({ recordTime: moment(e) });
            getTableData();
          },
        },
        sort: 1,
      },
    ],
    radioArr: [
      {
        label: '',
        name: 'timePoint',
        config: {},
        cld: [
          { name: '2', value: '02:00' },
          { name: '6', value: '06:00' },
          { name: '10', value: '10:00' },
          { name: '14', value: '14:00' },
          { name: '18', value: '18:00' },
          { name: '22', value: '22:00' },
        ],
        change: (e) => {
          getTableData();
        },
        sort: 2,
      },
    ],
    btnArr: [
      {
        name: '查询',
        callback: () => {
          getTableData();
        },
        sort: 4,
        style: { marginRight: '15px' },
      },
      {
        name: '保存',
        callback: () => {
          batchUpdate();
        },
        sort: 4,
        style: { marginRight: '15px' },
      },
      {
        name: '新增',
        type: 'primary',
        sort: 5,
        style: { marginRight: '15px' },
        callback: () => {
          addOrEdit('add', true);
        },
      },
      // {
      //   name: '导出',
      //   type: 'primary',
      //   sort: 5,
      //   style: { marginRight: '15px' },
      //   callback: () => {
      //     let realSelectKeys = yTable?.table?.selectKeys.filter((it) => parseFloat(it) > 1);
      //     if (!realSelectKeys?.length) {
      //       message.warn('未填写信息，不允许导出');
      //       return;
      //     }
      //     let res = isOnePeople(yTable?.table?.selectRows);
      //     if (!res) {
      //       message.warn('一次导出一个人的信息');
      //       return;
      //     }
      //     let ids = realSelectKeys?.join(',') || '';
      //     excelExport({
      //       // TODO:替换接口路径
      //       api: '/blood-sugar/export', //导出接口路径
      //       ids: ids, //勾选的行id数组集合
      //       fileName: '三测单', //导出文件名称
      //     });
      //   },
      // },
    ],
    layout: 'inline',
    form: topFrom,
    cls: 'opera',
    initialValues: {
      timePoint: '02:00',
      recordTime: moment().format('YYYY-MM-DD'),
    },
  };

  // modal配置项
  const [modalForm] = Form.useForm();
  const yTableColumnsAll = [
    {
      title: '床位号',
      dataIndex: 'bed',
      key: 'bed',
      align: 'left',
      ellipsis: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: '住院号',
      dataIndex: 'businessNo',
      key: 'businessNo',
      align: 'left',
      ellipsis: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      ellipsis: true,
      fixed: 'left',
      width: 60,
    },
    {
      title: '体温(°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      align: 'left',
      ellipsis: true,
      width: 60,
      render: (text, record) => {
        return (
          // <div className={record.isC && !text ? 'redMark' : ''}>
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.temperature = e.target.value;
              setYTable({ ...yTable });
            }}
          />
          // </div>
        );
      },
    },
    {
      title: '脉搏心率(次/分)',
      dataIndex: 'pulse',
      key: 'pulse',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.pulse = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '呼吸(次/分)',
      dataIndex: 'breathing',
      key: 'breathing',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.breathing = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '收缩压(mmHg)',
      dataIndex: 'highBloodPressure',
      key: 'highBloodPressure',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.highBloodPressure = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '舒张压(mmHg)',
      dataIndex: 'lowBloodPressure',
      key: 'lowBloodPressure',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.lowBloodPressure = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '血氧饱和度(%)',
      dataIndex: 'bloodOxygen',
      key: 'bloodOxygen',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.bloodOxygen = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '入量(ml)',
      dataIndex: 'intake',
      key: 'intake',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.intake = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '出量(ml)',
      dataIndex: 'output',
      key: 'output',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.output = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '小便(ml)',
      dataIndex: 'urine',
      key: 'urine',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.urine = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '大便(次/日)',
      dataIndex: 'defecate',
      key: 'defecate',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.defecate = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '大便方式',
      dataIndex: 'defecatePattern',
      key: 'defecatePattern',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Select
            className={record.isC && !text ? 'redMark' : ''}
            style={{ width: '100%' }}
            value={text}
            options={yTable.table.basicData['0018'] || []}
            onChange={(e) => {
              record.defecatePattern = e || '';
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '体重(Kg)',
      dataIndex: 'weight',
      key: 'weight',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.weight = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '护士签名',
      dataIndex: 'nurseSign',
      key: 'nurseSign',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.nurseSign = e.target.value;
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'opera',
      align: 'center',
      fixed: 'right',
      width: 120,
      ellipsis: true,
      render: (text, record) => (
        // className={styles.opera}
        <div>
          <a
            onClick={() => {
              openDrawer(record);
            }}
          >
            个人记录
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              openTemperatureModal(record);
            }}
          >
            三测单
          </a>
        </div>
      ),
    },
  ];
  const yTableColumnsPerson = [
    // {
    //   title: '床位号',
    //   dataIndex: 'bed',
    //   key: 'bed',
    //   align: 'left',
    //   ellipsis: true,
    //   fixed: 'left',
    //   width: 100,
    // },
    // {
    //   title: '住院号',
    //   dataIndex: 'businessNo',
    //   key: 'businessNo',
    //   align: 'left',
    //   ellipsis: true,
    //   fixed: 'left',
    //   width: 100,
    // },
    // {
    //   title: '姓名',
    //   dataIndex: 'name',
    //   key: 'name',
    //   align: 'left',
    //   ellipsis: true,
    //   fixed: 'left',
    //   width: 60,
    // },
    {
      title: '日期',
      dataIndex: 'recordTime',
      key: 'recordTime',
      align: 'left',
      ellipsis: true,
      width: 110,
      render: (text, record) => {
        return (
          // <div className={record.isC && !text ? 'redMark' : ''}>
          <DatePicker
            onChange={(e) => {
              record.recordTime = e;
              setYTableDrawer({ ...yTableDrawer });
            }}
            value={text}
            format="YYYY-MM-DD"
          />

          // </div>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'timePoint',
      key: 'timePoint',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          // <div className={record.isC && !text ? 'redMark' : ''}>
          <TimePicker
            onChange={(e) => {
              record.timePoint = e;
              setYTableDrawer({ ...yTableDrawer });
            }}
            value={text}
            format={'HH:mm'}
          />
          // </div>
        );
      },
    },
    {
      title: '体温(°C)',
      dataIndex: 'temperature',
      key: 'temperature',
      align: 'left',
      ellipsis: true,
      width: 60,
      render: (text, record) => {
        return (
          // <div className={record.isC && !text ? 'redMark' : ''}>
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.temperature = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
          // </div>
        );
      },
    },
    {
      title: '脉搏心率(次/分)',
      dataIndex: 'pulse',
      key: 'pulse',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.pulse = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '呼吸(次/分)',
      dataIndex: 'breathing',
      key: 'breathing',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.breathing = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '收缩压(mmHg)',
      dataIndex: 'highBloodPressure',
      key: 'highBloodPressure',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.highBloodPressure = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '舒张压(mmHg)',
      dataIndex: 'lowBloodPressure',
      key: 'lowBloodPressure',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.lowBloodPressure = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '血氧饱和度(%)',
      dataIndex: 'bloodOxygen',
      key: 'bloodOxygen',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.bloodOxygen = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '入量(ml)',
      dataIndex: 'intake',
      key: 'intake',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.intake = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '出量(ml)',
      dataIndex: 'output',
      key: 'output',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.output = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '小便(ml)',
      dataIndex: 'urine',
      key: 'urine',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.urine = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '大便(次/日)',
      dataIndex: 'defecate',
      key: 'urine',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.defecate = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '体重(Kg)',
      dataIndex: 'weight',
      key: 'weight',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record) => {
        return (
          <Input
            className={record.isC && !text ? 'redMark' : ''}
            value={text}
            onChange={(e) => {
              record.weight = e.target.value;
              setYTableDrawer({ ...yTableDrawer });
            }}
          />
        );
      },
    },
    {
      title: '大便方式',
      dataIndex: 'defecatePattern',
      key: 'defecatePattern',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record) => {
        return (
          <Select
            className={record.isC && !text ? 'redMark' : ''}
            style={{ width: '100%' }}
            value={text}
            options={yTable.table.basicData['0018'] || []}
            onChange={(e) => {
              record.defecatePattern = e || '';
              setYTable({ ...yTable });
            }}
          />
        );
      },
    },
    // {
    //   title: '操作',
    //   key: 'opera',
    //   align: 'center',
    //   fixed: 'right',
    //   width: 60,
    //   ellipsis: true,
    //   render: (text, record) => (
    //     // className={styles.opera}
    //     <div>
    //       <a
    //         onClick={() => {
    //           openTemperatureModal(record);
    //         }}
    //       >
    //         三测单
    //       </a>
    //     </div>
    //   ),
    // },
  ];
  // table模块
  const [yTable, setYTable] = useState({
    table: {
      tabKey: '1',
      bordered: true,
      loading: false,
      dataSource: [],
      columns: yTableColumnsAll,
      key: Math.random(),
      scroll: { x: 1580 },
      // scroll: { x: 1580 },
      //  y: '100%'
      dataRow: {},
      rowKey: 'id',
      pagination: {
        current: 1,
        pageSize,
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: (total) => {
          return `共 ${total} 条`;
        },
        onChange: (page, pageSize) => {
          console.log('changePage----', page, pageSize);
          yTable.table.pagination.current = page;
          yTable.table.pagination.pageSize = pageSize;
          setYTable({ ...yTable });
        },
      },
      basicData: {},
      oClick: (count) => {
        yTable.table.dataRow = count;
        setYTable({ ...yTable });
      },
      selectKeys: [],
      selectRows: [],
      rowSelection: {
        columnWidth: 30,
        selectedRowKeys: yTable?.table?.selectKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          yTable.table.selectKeys = selectedRowKeys;
          yTable.table.selectRows = selectedRows;
          setYTable({ ...yTable });
        },
      },
    },
  });
  const [topFromDrawer] = Form.useForm();
  const searchFormDrawer = {
    inputArr: [
      {
        label: '住院号',
        name: 'businessNo',
        placeholder: '请输入住院号',
        sort: 2,
        style: { width: '200px' },
        config: { disabled: true },
        pressEnter: (enter) => {
          getTableDataPerson();
        },
      },
    ],
    dateArr: [
      {
        label: '时间范围',
        name: 'timeRange',
        config: {
          dateType: 'range',
          timeStart: moment().startOf('day'),
          timeEnd: moment().endOf('day'),
          showTime: false,
          onChange: (e) => {
            topFromDrawer.setFieldsValue({ timeRange: e });
            getTableDataPerson();
          },
        },
        style: { width: '220px' },
        sort: 1,
      },
    ],
    btnArr: [
      {
        name: '查询',
        callback: () => {
          getTableDataPerson();
        },
        sort: 4,
        style: { marginRight: '15px' },
      },
      {
        name: '保存',
        callback: () => {
          batchUpdateDrawer();
        },
        sort: 4,
        style: { marginRight: '15px' },
      },
    ],
    layout: 'inline',
    form: topFromDrawer,
    cls: 'opera',
    initialValues: {
      timeRange: [
        moment().startOf('day').format('YYYY-MM-DD'),
        // moment().subtract(90, 'days').format('YYYY-MM-DD'),
        moment().endOf('day').format('YYYY-MM-DD'),
      ],
    },
  };
  const [yTableDrawer, setYTableDrawer] = useState({
    table: {
      tabKey: '1',
      bordered: true,
      loading: false,
      dataSource: [],
      columns: yTableColumnsPerson,
      key: Math.random(),
      scroll: { x: 1580 },
      // scroll: { x: 1580 },
      //  y: '100%'
      dataRow: {},
      rowKey: 'id',
      pagination: {
        current: 1,
        pageSize,
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: (total) => {
          return `共 ${total} 条`;
        },
        onChange: (page, pageSize) => {
          console.log('changePage----', page, pageSize);
          yTableDrawer.table.pagination.current = page;
          yTableDrawer.table.pagination.pageSize = pageSize;
          // queryTypeDetailsListServices();
        },
      },
      basic: {},
      oClick: (count) => {
        yTableDrawer.table.dataRow = count;
        setYTableDrawer({ ...yTableDrawer });
      },
    },
  });
  const batchUpdateDrawer = () => {
    if (!yTableDrawer.table.dataSource?.length) {
      message.error('表格数据为空，不允许提交');
      return;
    }
    const params = yTableDrawer.table.dataSource?.map((it) => {
      return {
        ...it,
        timePoint: (it?.timePoint && moment(it.timePoint)?.format('HH:mm')) || '',
        recordTime: (it?.recordTime && moment(it.recordTime)?.format('YYYY-MM-DD')) || '',
        id: parseFloat(it.id) > 1 ? it.id : '',
      };
    });

    yTableDrawer.table.loading = true;
    setYTableDrawer({ ...yTableDrawer });
    batchUpdateVitalSignRecord(params)
      .then(() => {
        yTableDrawer.table.loading = false;
        setYTableDrawer({ ...yTableDrawer });
        getTableDataPerson();
        getTableData();
      })
      .catch((err) => {
        yTableDrawer.table.loading = false;
        setYTableDrawer({ ...yTableDrawer });
        console.log('batchQueryVitalSignRecord---err', err);
      });
  };
  // 判断新增 / 编辑
  const [modeType, setModeType] = useState({
    type: null,
    visible: false,
    loading: false,
  });

  // 新增 / 编辑
  const addOrEdit = (type, visible, record) => {
    if (type === 'edit' && !Object.getOwnPropertyNames(record).length) {
      return message.error('请选中行');
    }
    modalForm.resetFields();
    if (type === 'edit') {
      modalForm.setFieldsValue({
        ...record,
        leaveStartTime: record?.leaveStartTime && moment(record?.leaveStartTime),
        leaveEndTime: record?.leaveEndTime && moment(record?.leaveEndTime),
      });
    }
    changeModal(type, visible);
  };
  // 修改弹窗配置
  const changeModal = (type, visible) => {
    modeType.type = type;
    modeType.visible = visible;
    setModeType({ ...modeType });
  };
  // 获取列表Table数据
  const getTableData = () => {
    const { timePoint, recordTime } = topFrom.getFieldsValue();
    const params = {
      recordTime: (recordTime && moment(recordTime).format('YYYY-MM-DD')) || '',
      timePoint,
    };

    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    batchQueryVitalSignRecord(params)
      .then((res) => {
        yTable.table.dataSource =
          res?.data?.map((it) => {
            return { ...it, id: !it.id ? Math.random() : it.id };
          }) || [];
        yTable.table.loading = false;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('batchQueryVitalSignRecord---err', err);
      });
  };
  // 根据时间范围和姓名去查询个人记录
  const getTableDataPerson = () => {
    const { timeRange, businessNo } = topFromDrawer.getFieldsValue();
    const startTime = timeRange && timeRange[0] ? `${timeRange[0]} 00:00:00` : '';
    const endTime = timeRange && timeRange[1] ? `${timeRange[1]} 23:59:59` : '';
    const params = {
      startTime,
      endTime,
      businessNo,
    };
    yTableDrawer.table.loading = true;
    yTableDrawer.table.dataSource = [];
    setYTableDrawer({ ...yTableDrawer });
    queryVitalSignRecord(params)
      .then((res) => {
        yTableDrawer.table.dataSource =
          res?.data?.map((it) => {
            return {
              ...it,
              timePoint: (it.timePoint && moment(it.timePoint, 'HH:mm')) || '',
              recordTime: (it.recordTime && moment(it.recordTime, 'YYYY-MM-DD')) || '',
              id: !it.id ? Math.random() : it.id,
            };
          }) || [];
        yTableDrawer.table.loading = false;
        setYTableDrawer({ ...yTableDrawer });
      })
      .catch((err) => {
        yTableDrawer.table.loading = false;
        setYTableDrawer({ ...yTableDrawer });
        console.log('queryVitalSignRecord---err', err);
      });
  };
  // 批量保存
  const batchUpdate = () => {
    if (!yTable.table.dataSource?.length) {
      message.error('表格数据为空，不允许提交');
      return;
    }
    const { recordTime, timePoint } = topFrom.getFieldsValue();
    const params = yTable.table.dataSource?.map((it) => {
      return {
        ...it,
        timePoint: timePoint || '',
        recordTime: moment(recordTime)?.format('YYYY-MM-DD') || '',
        id: parseFloat(it.id) > 1 ? it.id : '',
      };
    });

    yTable.table.loading = true;
    setYTable({ ...yTable });
    batchUpdateVitalSignRecord(params)
      .then((res) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        getTableData();
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('batchQueryVitalSignRecord---err', err);
      });
  };
  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { recordTime, timePoint } = formData;
    console.log('recordTime, timePoint: ', recordTime, timePoint);
    const query = {
      ...modalForm.getFieldsValue(),
      recordTime: recordTime && moment(recordTime).format('YYYY-MM-DD'),
      timePoint: timePoint && moment(timePoint).format('HH:mm'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      console.log('query: ', query);
      addVitalSignRecord(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-addVitalSignRecord: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    }
  };
  // 获取字典数据
  const getDictionaryData = () => {
    dictTypeSelectPullDown(['0005', '0018']).then((response) => {
      setBasic(response.data);
      yTable.table.basicData = response.data;
    });
  };
  const [nameSelectList, setNameSelectList] = useState([]); // 复合搜索的人的集合
  // 姓名搜索框
  const nameSelectBlur = async (e) => {
    setNameSelectList([]);
    patientQuery({ keyWords: e || '' })
      .then((res) => {
        const data =
          res?.data?.map((item) => {
            return {
              label: `${item.name}-${item.businessNo}`,
              value: item.businessNo,
              bedName: item.totalName,
              name: item.name,
            };
          }) || [];
        setNameSelectList(data);
      })
      .catch((err) => {
        console.log('err-patientQuery: ', err);
      });
  };
  const TemperatureRef = useRef();
  const print = useReactToPrint({
    content: () => TemperatureRef.current,
    pageStyle: printStyle,
  });
  const [temperatureModal, setTemperatureModal] = useState({
    loading: false,
    visible: false,
    data: {},
  });
  const openTemperatureModal = async (record) => {
    const { recordTime } = topFrom.getFieldsValue();
    console.log('recordTime: ', recordTime);
    const res = await queryThreeVolume({
      businessNo: record?.businessNo || '',
      endTime: (recordTime && moment(recordTime)?.add(6, 'd')?.format('YYYY-MM-DD')) || undefined,
      startTime: (recordTime && moment(recordTime)?.format('YYYY-MM-DD')) || undefined,
    });
    console.log('res: ', res);
    temperatureModal.data = res?.data || {};
    temperatureModal.visible = true;

    setTemperatureModal({ ...temperatureModal });
  };
  const tabChange = (e) => {
    yTable.table.tabKey = e;
    yTable.table.columns = e === '1' ? yTableColumnsAll : yTableColumnsPerson;
    getTableData();
    setYTable({ ...yTable });
  };
  const [drawerConfig, setDrawerConfig] = useState({ visible: false, loading: false });
  const openDrawer = async () => {
    await topFromDrawer.resetFields();
    await topFromDrawer.setFieldsValue({
      businessNo: yTable.table.dataRow.businessNo,
      startTime: moment(),
      endTime: moment(),
    });
    drawerConfig.visible = true;
    setDrawerConfig({ ...drawerConfig });
    getTableDataPerson();
  };
  const closeDrawer = () => {
    drawerConfig.visible = false;
    setDrawerConfig({ ...drawerConfig });
  };
  // 初始化
  useEffect(() => {
    getDictionaryData();
    nameSelectBlur();
    getTableData();
  }, []);
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <SearchForm searchForm={searchTopForm} />
      <div ref={tableRef} style={{ height: tableHeight }} className="yTableStyle">
        <YTable {...yTable} />
      </div>
      <Modal
        className={styles.bloodModal}
        width={720}
        keyboard={false}
        maskClosable={false}
        title={modeType.type === 'add' ? '新增' : '编辑'}
        centered
        visible={modeType.visible}
        confirmLoading={modeType.loading}
        onOk={() => {
          modalForm.submit();
        }}
        onCancel={() => changeModal('', false)}
      >
        <Form
          name="basic"
          form={modalForm}
          labelCol={{ flex: '100px' }}
          onFinish={saveModalInfo}
          initialValues={{ recordTime: moment(), timePoint: moment() }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="床位号" name="bedName">
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="住院号" name="businessNo" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="请输入姓名"
                  onChange={(value, option) => {
                    modalForm.setFieldsValue({
                      businessNo: value,
                      name: option.name,
                      bedName: option.bedName,
                    });
                  }}
                  options={nameSelectList}
                  filterOption={(inputValue, option) => {
                    return option.label.indexOf(inputValue) > -1;
                  }}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="日期" name="recordTime" rules={[{ required: true }]}>
                <DatePicker format="YYYY-MM-DD" showTime={true} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item label="时间段" name="timePoint" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="请选择"
                  onChange={(value, option) => {
                    // modalForm.setFieldsValue({ businessNo: value, name: option.label });
                  }}
                  options={timePointOptions}
                  filterOption={(inputValue, option) => {
                    return option.label.indexOf(inputValue) > -1;
                  }}
                ></Select>
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label="时间" name="timePoint" rules={[{ required: true }]}>
                <TimePicker format={'HH:mm'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="体温" name={'temperature'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="°C" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="脉搏心率" name={'pulse'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="次/分" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="呼吸" name={'breathing'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="次/分" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="收缩压" name={'highBloodPressure'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="mmHg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="舒张压" name={'lowBloodPressure'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="mmHg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="血氧饱和度" name={'bloodOxygen'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="%" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="入量" name={'intake'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="ml" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="出量" name={'output'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="ml" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="小便" name={'urine'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="ml" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="大便" name={'defecate'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="次/日" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="大便方式" name={'defecatePattern'}>
                <Select style={{ width: '100%' }} options={yTable.table.basicData['0018'] || []} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="体重" name={'weight'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="Kg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* TODO:修改字段 */}
              <Form.Item label="护士签名" name={'nurseSign'}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        className="temperature"
        width={900}
        keyboard={false}
        maskClosable={false}
        title={'三测单'}
        centered
        visible={temperatureModal.visible}
        confirmLoading={temperatureModal.loading}
        destroyOnClose={true}
        okText="打印"
        onOk={() => {
          print();
        }}
        onCancel={() => {
          temperatureModal.visible = false;
          setTemperatureModal({ ...temperatureModal });
        }}
      >
        <style>{printStyle}</style>
        <div className="temperature">
          <Temperature data={temperatureModal?.data} ref={TemperatureRef} />
        </div>
      </Modal>
      <Drawer
        style={{ position: 'absolute', overflowY: 'hidden' }}
        getContainer={false}
        width="100%"
        height="100%"
        title={`个人记录（${yTable.table.dataRow?.name}）`}
        placement="right"
        onClose={closeDrawer}
        visible={drawerConfig.visible}
      >
        <SearchForm searchForm={searchFormDrawer} />
        <YTable {...yTableDrawer} />
      </Drawer>
    </div>
  );
};
