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
import {
  batchQueryNursingRecord,
  batchUpdateNursingRecord,
  addNursingRecord,
} from '@/services/nursingManagement/nursingRecord';
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
        name: 'recordTime',
        config: {
          time: moment(),
          showTime: false,
          onChange: (e) => {
            topFrom.setFieldsValue({ recordTime: moment(e) });
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
    // radioArr: [
    //   {
    //     label: '',
    //     name: 'radio',
    //     config: {},
    //     cld: [
    //       { name: '2', value: '2' },
    //       { name: '6', value: '6' },
    //       { name: '10', value: '10' },
    //       { name: '14', value: '14' },
    //       { name: '18', value: '18' },
    //       { name: '22', value: '22' },
    //     ],
    //     change: (e) => {
    //       console.log('radioArr----', e);
    //     },
    //     sort: 2,
    //   },
    // ],
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
        callback: () => {
          addOrEdit('add', true);
        },
      },
    ],
    layout: 'inline',
    form: topFrom,
    cls: 'opera',
    initialValues: {
      recordTime: moment().format('YYYY-MM-DD'),
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
      dataSource: [],
      columns: [
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
                  setYTable({ ...yTable });
                }}
                value={text}
                format={'HH:mm'}
              />
              // </div>
            );
          },
        },
        {
          title: '打扫房间',
          dataIndex: 'isCleanRoom',
          key: 'isCleanRoom',
          align: 'center',
          ellipsis: true,
          width: 60,
          render: (text, record) => {
            return (
              <Checkbox
                checked={text}
                onChange={(e) => {
                  record.isCleanRoom = e.target.checked;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        {
          title: '清洗便池',
          dataIndex: 'isCleanToilet',
          key: 'isCleanToilet',
          align: 'center',
          ellipsis: true,
          width: 60,
          render: (text, record) => {
            return (
              <Checkbox
                checked={text}
                onChange={(e) => {
                  record.isCleanToilet = e.target.checked;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        {
          title: '洗头理发',
          dataIndex: 'isHaircut',
          key: 'isHaircut',
          align: 'center',
          ellipsis: true,
          width: 60,
          render: (text, record) => {
            return (
              <Checkbox
                checked={text}
                onChange={(e) => {
                  record.isHaircut = e.target.checked;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        {
          title: '晾晒衣服',
          dataIndex: 'isHangClothes',
          key: 'isHangClothes',
          align: 'center',
          ellipsis: true,
          width: 60,
          render: (text, record) => {
            return (
              <Checkbox
                checked={text}
                onChange={(e) => {
                  record.isHangClothes = e.target.checked;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        {
          title: '修剪指甲',
          dataIndex: 'isManicure',
          key: 'isManicure',
          align: 'center',
          ellipsis: true,
          width: 60,
          render: (text, record) => {
            return (
              <Checkbox
                checked={text}
                onChange={(e) => {
                  record.isManicure = e.target.checked;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        {
          title: '进餐送餐',
          dataIndex: 'isMeals',
          key: 'isMeals',
          align: 'center',
          ellipsis: true,
          width: 60,
          render: (text, record) => {
            return (
              <Checkbox
                checked={text}
                onChange={(e) => {
                  record.isMeals = e.target.checked;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        // TODO:
        {
          title: '生活用水',
          dataIndex: 'isMeals',
          key: 'isMeals',
          align: 'center',
          ellipsis: true,
          width: 60,
          render: (text, record) => {
            return (
              <Checkbox
                checked={text}
                onChange={(e) => {
                  record.isMeals = e.target.checked;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        {
          title: '身心观察记录',
          dataIndex: 'physicalAndMentalStatus',
          key: 'physicalAndMentalStatus',
          align: 'left',
          ellipsis: true,
          width: 120,
          render: (text, record) => {
            return (
              <Input.TextArea
                AUTOCOMPLETE="OFF"
                rows={1}
                value={text}
                onChange={(e) => {
                  record.physicalAndMentalStatus = e.target.value;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
        {
          title: '其他',
          dataIndex: 'other',
          key: 'other',
          align: 'left',
          ellipsis: true,
          width: 120,
          render: (text, record) => {
            return (
              <Input.TextArea
                AUTOCOMPLETE="OFF"
                rows={1}
                value={text}
                onChange={(e) => {
                  record.other = e.target.value;
                  setYTable({ ...yTable });
                }}
              />
            );
          },
        },
      ],
      key: Math.random(),
      scroll: { x: 1140, y: '100%' },
      // scroll: { x: 1520 },
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
          yTable.table.pagination.current = page;
          yTable.table.pagination.pageSize = pageSize;
          setYTable({ ...yTable });
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
    const { timePoint, recordTime } = topFrom.getFieldsValue();
    const params = {
      recordTime,
      timePoint,
    };

    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    batchQueryNursingRecord(params)
      .then((res) => {
        yTable.table.dataSource = res?.data || [];
        yTable.table.loading = false;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('batchQueryVitalSignRecord---err', err);
      });
  };
  // 批量保存
  const batchUpdate = () => {
    if (!yTable.table.dataSource?.length) {
      message.error('表格数据为空，不允许提交');
      return;
    }
    const { timePoint, recordTime } = topFrom.getFieldsValue();
    const params = yTable.table.dataSource?.map((it) => {
      return { ...it, timePoint, recordTime: moment(recordTime)?.format('YYYY-MM-DD') || '' };
    });

    yTable.table.loading = true;
    setYTable({ ...yTable });
    batchUpdateNursingRecord(params)
      .then((res) => {
        yTable.table.dataSource = res?.data || [];
        yTable.table.loading = false;
        setYTable({ ...yTable });
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
    const query = {
      ...modalForm.getFieldsValue(),
      recordTime: recordTime && moment(recordTime).format('YYYY-MM-DD'),
      timePoint: timePoint && moment(timePoint).format('HH:mm'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      addNursingRecord(query)
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
        return { ...item, label: item['name'], value: item['businessNo'] };
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
    getTableData();
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
            <Col span={6}>
              <Form.Item label="打扫房间" name={'isCleanRoom'} initialValue={'0'}>
                <Checkbox onChange={() => {}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="清洗便池" name={'isCleanToilet'} initialValue={'0'}>
                <Checkbox onChange={() => {}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="洗头理发" name={'isHaircut'} initialValue={'0'}>
                <Checkbox onChange={() => {}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="晾晒衣服" name={'isHangClothes'} initialValue={'0'}>
                <Checkbox onChange={() => {}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="修剪指甲" name={'isManicure'} initialValue={'0'}>
                <Checkbox onChange={() => {}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="进餐送餐" name={'isMeals'} initialValue={'0'}>
                <Checkbox onChange={() => {}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              {/* TODO */}
              <Form.Item label="生活用水" name={'isMeals'} initialValue={'0'}>
                <Checkbox onChange={() => {}} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="身心观察记录" name={'physicalAndMentalStatus'}>
                <Input.TextArea AUTOCOMPLETE="OFF" rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="其他" name={'other'}>
                <Input.TextArea AUTOCOMPLETE="OFF" rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
