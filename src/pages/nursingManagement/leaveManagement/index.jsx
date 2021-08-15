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
import { findValByKey, getDefaultOption } from '@/utils/common';
import { config } from '@/utils/const';
const { pageSize, pageNum } = config;
import { useTableHeight } from '@/utils/tableHeight';
const { TextArea } = Input;
import moment from 'moment';
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  // 上部搜索searchForm模块
  const [topFrom] = Form.useForm();
  const searchTopForm = {
    inputArr: [
      {
        name: 'keyWord',
        placeholder: '请输入姓名',
        sort: 2,
        style: { width: '200px' },
        pressEnter: (enter) => {
          getTableData();
        },
      },
      {
        name: 'businessNo',
        placeholder: '住院号',
        sort: 2,
        style: { width: '200px' },
        pressEnter: (enter) => {
          getTableData();
        },
      },
    ],
    dateArr: [
      {
        label: '请假时间',
        name: 'timeRange',
        config: {
          dateType: 'range',
          timeStart: moment().startOf('day'),
          timeEnd: moment().endOf('day'),
          showTime: false,
          onChange: (e) => {
            topFrom.setFieldsValue({ timeRange: e });
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
          getTableData();
        },
        sort: 2,
        style: { marginRight: '15px' },
      },
      {
        name: '新增',
        type: 'primary',
        // style: {  },
        sort: 2,
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
      dataSource: [],
      columns: [
        {
          title: '住院号',
          dataIndex: 'businessNo',
          key: 'businessNo',
          align: 'left',
          ellipsis: true,
          width: 120,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          ellipsis: true,
          width: 120,
        },
        {
          title: '请假开始日期',
          dataIndex: 'leaveStartTime',
          key: 'leaveStartTime',
          align: 'left',
          ellipsis: true,
          width: 150,
        },
        {
          title: '请假结束日期',
          dataIndex: 'leaveEndTime',
          key: 'leaveEndTime',
          align: 'left',
          ellipsis: true,
          width: 150,
        },
        {
          title: '请假原因',
          dataIndex: 'reasonForLeave',
          key: 'reasonForLeave',
          align: 'left',
          ellipsis: true,
          width: 120,
        },
        {
          title: '监护人',
          dataIndex: 'guardian',
          key: 'guardian',
          align: 'left',
          ellipsis: true,
          width: 120,
        },
        {
          title: '医院负责人',
          dataIndex: 'hospitalDirector',
          key: 'hospitalDirector',
          align: 'left',
          ellipsis: true,
          width: 120,
        },
        {
          title: '操作',
          key: 'opera',
          align: 'center',
          width: 130,
          render: (text, record) => (
            <div className={styles.opera}>
              <a
                onClick={() => {
                  addOrEdit('edit', true, record);
                }}
              >
                编辑
              </a>

              <Divider type="vertical" />
              <a
                onClick={() => {
                  del(record);
                }}
              >
                删除
              </a>
            </div>
          ),
        },
      ],
      key: Math.random(),
      scroll: { x: 940, y: '100%' },
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
      businessNo,
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

  // 初始化
  useEffect(() => {
    getDictionaryData();
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
          labelCol={{ flex: '140px' }}
          onFinish={saveModalInfo}
          initialValues={{}}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="住院号" name="businessNo" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="请假开始时间" name="leaveStartTime">
                <DatePicker format="YYYY-MM-DD HH:mm:s" showTime={true} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="请假结束时间" name="leaveEndTime">
                <DatePicker format="YYYY-MM-DD HH:mm:s" showTime={true} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="请假原因" name="reasonForLeave">
                <TextArea placeholder="请假原因" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="监护人" name="guardian" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="医院负责人" name="hospitalDirector" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
