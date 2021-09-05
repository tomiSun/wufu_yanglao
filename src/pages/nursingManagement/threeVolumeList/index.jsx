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
  Radio,
  InputNumber,
  message,
  Button,
  Divider,
  DatePicker,
  TimePicker,
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
import { recordAdd } from '../../../services/syntheticModule/record';
export default () => {
  const timePointOptions = [
    { name: '2', value: '2', lable: '2' },
    { name: '6', value: '6', lable: '6' },
    { name: '10', value: '10', lable: '10' },
    { name: '14', value: '14', lable: '14' },
    { name: '18', value: '18', lable: '18' },
    { name: '22', value: '22', lable: '22' },
  ];
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  // 上部搜索searchForm模块
  const [topFrom] = Form.useForm();
  const searchTopForm = {
    inputArr: [
      // {
      //   name: 'keyWord',
      //   placeholder: '请输入姓名',
      //   sort: 2,
      //   style: { width: '200px' },
      //   pressEnter: (enter) => {
      //     getTableData();
      //   },
      // },
    ],
    dateArr: [
      {
        label: '时间',
        name: 'time',
        config: {
          time: moment(),
          showTime: false,
          onChange: (e) => {
            topFrom.setFieldsValue({ time: moment(e) });
            getTableData();
          },
        },
        sort: 1,
      },
    ],
    // renderArr: [
    //   {
    //     label: '',
    //     name: 'render',
    //     renderFun: (
    //       <TimePicker
    //         onChange={() => {}}
    //         defaultValue={moment('00:00', 'HH:mm')}
    //         format={'HH:mm'}
    //       />
    //     ),
    //     sort: 3,
    //   },
    // ],
    radioArr: [
      {
        label: '',
        name: 'radio',
        config: {},
        cld: [
          { name: '2', value: '2' },
          { name: '6', value: '6' },
          { name: '10', value: '10' },
          { name: '14', value: '14' },
          { name: '18', value: '18' },
          { name: '22', value: '22' },
        ],
        change: (e) => {
          console.log('radioArr----', e);
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
          // getTableData();
        },
        sort: 4,
        style: { marginRight: '15px' },
      },
      {
        name: '新增',
        type: 'primary',
        sort: 5,
        callback: () => {
          addOrEdit('add', true);
        },
      },
    ],
    layout: 'inline',
    form: topFrom,
    cls: 'opera',
    initialValues: {
      timeRange: [
        moment().startOf('day').format('YYYY-MM-DD'),
        // moment().subtract(90, 'days').format('YYYY-MM-DD'),
        moment().endOf('day').format('YYYY-MM-DD'),
      ],
    },
  };

  // modal配置项
  const [modalForm] = Form.useForm();

  // 基础字典数据
  const [basic, setBasic] = useState({});

  // table模块
  const [yTable, setYTable] = useState({
    table: {
      bordered: true,
      loading: false,
      dataSource: [{ id: '1', temperature: '1', pulse: '1' }],
      columns: [
        {
          title: '床位号',
          dataIndex: 'bedName',
          key: 'bedName',
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
          render: () => '床位号',
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
            return <Input />;
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
            return <Input />;
          },
        },
        {
          title: '高压(mmHg)',
          dataIndex: 'highBloodPressure',
          key: 'highBloodPressure',
          align: 'left',
          ellipsis: true,
          width: 80,
          render: (text, record) => {
            return <Input />;
          },
        },
        {
          title: '低压(mmHg)',
          dataIndex: 'lowBloodPressure',
          key: 'lowBloodPressure',
          align: 'left',
          ellipsis: true,
          width: 80,
          render: (text, record) => {
            return <Input />;
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
            return <Input />;
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
            return <Input />;
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
            return <Input />;
          },
        },
        {
          title: '大便(ml)',
          // TODO:
          dataIndex: 'urine',
          key: 'urine',
          align: 'left',
          ellipsis: true,
          width: 80,
          render: (text, record) => {
            return <Input />;
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
            return <Input />;
          },
        },
        // TODO:
        {
          title: '血氧饱和度',
          dataIndex: 'weight',
          key: 'weight',
          align: 'left',
          ellipsis: true,
          width: 80,
          render: (text, record) => {
            return <Input />;
          },
        },
        // {
        //   title: '打扫房间',
        //   dataIndex: 'isCleanRoom',
        //   key: 'isCleanRoom',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 60,
        //   render: (text, record) => {
        //     return <Checkbox onChange={() => {}} />;
        //   },
        // },
        // {
        //   title: '清洗便池',
        //   dataIndex: 'isCleanToilet',
        //   key: 'isCleanToilet',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 60,
        //   render: (text, record) => {
        //     return <Checkbox onChange={() => {}} />;
        //   },
        // },
        // {
        //   title: '洗头理发',
        //   dataIndex: 'isHaircut',
        //   key: 'isHaircut',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 60,
        //   render: (text, record) => {
        //     return <Checkbox onChange={() => {}} />;
        //   },
        // },
        // {
        //   title: '晾晒衣服',
        //   dataIndex: 'isHangClothes',
        //   key: 'isHangClothes',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 60,
        //   render: (text, record) => {
        //     return <Checkbox onChange={() => {}} />;
        //   },
        // },
        // {
        //   title: '修剪指甲',
        //   dataIndex: 'isManicure',
        //   key: 'isManicure',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 60,
        //   render: (text, record) => {
        //     return <Checkbox onChange={() => {}} />;
        //   },
        // },
        // {
        //   title: '进餐送餐',
        //   dataIndex: 'isMeals',
        //   key: 'isMeals',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 60,
        //   render: (text, record) => {
        //     return <Checkbox onChange={() => {}} />;
        //   },
        // },
        // {
        //   title: '生活用水',
        //   dataIndex: 'isMeals',
        //   key: 'isMeals',
        //   align: 'center',
        //   ellipsis: true,
        //   width: 60,
        //   render: (text, record) => {
        //     return <Checkbox onChange={() => {}} />;
        //   },
        // },
        // {
        //   title: '身心观察记录',
        //   dataIndex: 'physicalAndMentalStatus',
        //   key: 'physicalAndMentalStatus',
        //   align: 'left',
        //   ellipsis: true,
        //   width: 120,
        //   render: (text, record) => {
        //     return <Input.TextArea AUTOCOMPLETE="OFF"  rows={1} />;
        //   },
        // },
        // {
        //   title: '其他',
        //   dataIndex: 'other',
        //   key: 'other',
        //   align: 'left',
        //   ellipsis: true,
        //   width: 120,
        //   render: (text, record) => {
        //     return <Input.TextArea AUTOCOMPLETE="OFF"  rows={1} />;
        //   },
        // },
        {
          title: '操作',
          key: 'opera',
          align: 'center',
          fixed: 'right',
          width: 60,
          ellipsis: true,
          render: (text, record) => (
            // className={styles.opera}
            <div>
              <a onClick={() => {}}>三测单</a>
            </div>
          ),
        },
      ],
      key: Math.random(),
      scroll: { x: 1140 },
      // scroll: { x: 1580 },
      //  y: '100%'
      dataRow: {},
      rowKey: 'id',
      pagination: {
        current: 1,
        pageSize: pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => {
          return `共 ${total} 条`;
        },
        onChange: (page, pageSize) => {
          console.log('changePage----', page, pageSize);
          yTable.table.pagination.current = page;
          yTable.table.pagination.pageSize = pageSize;
          // queryTypeDetailsListServices();
        },
      },
      basic: {},
      oClick: (count) => {
        yTable.table.dataRow = count;
        setYTable({ ...yTable });
      },
    },
  });

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
  // 删除
  const del = (record) => {
    if (!!Object.getOwnPropertyNames(record).length) {
      Modal.confirm({
        title: '是否要删除该条数据',
        icon: <DeleteOutlined />,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        style: { padding: '30px' },
        onOk() {
          leaveManagementDel({ id: record.id })
            .then((res) => {
              message.success(res.msg);
              yTable.table.dataRow = {};
              getTableData();
            })
            .catch((err) => {
              console.log('err-leaveManagementDel: ', err);
            });
        },
      });
    } else {
      message.error('请选中行');
    }
  };
  // 获取列表Table数据
  const getTableData = () => {
    const { keyWord, businessNo, timeRange } = topFrom.getFieldsValue();
    const startTime = timeRange && timeRange[0] ? `${timeRange[0]} 00:00:00` : '';
    const endTime = timeRange && timeRange[1] ? `${timeRange[1]} 23:59:59` : '';
    const params = {
      name: keyWord,
      startTime,
      endTime,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    leaveManagementSelect(params)
      .then((res) => {
        yTable.table.dataSource = res?.data?.list || [];
        yTable.table.loading = false;
        yTable.table.pagination.current = res?.data?.pageNum;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('leaveManagementSelect---err', err);
      });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { leaveStartTime, leaveEndTime } = formData;
    let query = {
      ...modalForm.getFieldsValue(),
      leaveStartTime: leaveStartTime && moment(leaveStartTime).format('YYYY-MM-DD HH:mm:ss'),
      leaveEndTime: leaveEndTime && moment(leaveEndTime).format('YYYY-MM-DD HH:mm:ss'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      leaveManagementAdd(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-leaveManagementAdd: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    } else {
      leaveManagementUpdate(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-leaveManagementUpdate: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    }
  };
  // 获取字典数据
  const getDictionaryData = () => {
    dictTypeSelectPullDown(['0005']).then((response) => {
      setBasic(response.data);
    });
  };
  const [nameSelectList, setNameSelectList] = useState([]); //复合搜索的人的集合
  //姓名搜索框
  const nameSelectBlur = async (e, data) => {
    let res = await patientQuery({ keyWords: e || '' });
    if (!!res['data']) {
      let data = res['data'].map((item) => {
        return { label: item['name'], value: item['businessNo'] };
      });
      setNameSelectList(data);
    } else {
      setNameSelectList([]);
    }
  };
  // 初始化
  useEffect(() => {
    getDictionaryData();
    nameSelectBlur();
    // getTableData();
  }, []);
  return (
    <div>
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
          initialValues={{}}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Form.Item name="name" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="床位号" name="businessNo" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="住院号" name="businessNo" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="businessNo" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="请输入姓名"
                  // onSearch={nameSelectBlur}
                  onChange={(value, option) => {
                    console.log('value,option: ', value, option);
                    modalForm.setFieldsValue({ businessNo: value, name: option.label });
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
                <TimePicker onChange={() => {}} defaultValue={moment()} format={'HH:mm'} />
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
              <Form.Item label="高压" name={'highBloodPressure'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="mmHg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="低压" name={'lowBloodPressure'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="mmHg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="入量" name={'intake'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="ml" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" 出量" name={'output'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="ml" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" 小便" name={'urine'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="ml" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" 大便" name={'k'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="ml" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" 体重" name={'weight'}>
                <Input AUTOCOMPLETE="OFF" addonAfter="Kg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label=" 血氧饱和度" name={'m'}>
                <Input AUTOCOMPLETE="OFF" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
