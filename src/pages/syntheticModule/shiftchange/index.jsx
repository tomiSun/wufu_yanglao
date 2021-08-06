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
  shiftchangeAdd,
  shiftchangeDel,
  shiftchangeSelect,
  shiftchangeUpdate,
} from '@/services/syntheticModule/shiftchange';
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
        placeholder: '请输入交班员姓名',
        sort: 2,
        style: { width: '200px' },
        pressEnter: (enter) => {
          getTableData();
        },
      },
    ],
    dateArr: [
      // {
      //   label: '考核时间',
      //   name: 'startDate',
      //   config: {
      //     time: moment().format('YYYY-MM-DD'),
      //     showTime: false,
      //     onChange: (e) => {
      //       console.log('onChange-----startDate', e);
      //     },
      //   },
      //   sort: 1,
      // },
      // {
      //   // label: '时间范围',
      //   name: 'endDate',
      //   config: {
      //     time: moment().format('YYYY-MM-DD'),
      //   },
      //   sort: 2,
      // },
      {
        label: '交班时间',
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
          title: '提交时间',
          dataIndex: 'submissionTime',
          ellipsis: true,
          align: 'left',
          width: 150,
        },
        {
          title: '交班员',
          dataIndex: 'handoverOfficer',
          align: 'left',
          ellipsis: true,
          width: 160,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left',
          ellipsis: true,
          width: 160,
        },
        {
          title: '交班事宜',
          dataIndex: 'shiftHandover',
          align: 'left',
          ellipsis: true,
          width: 160,
        },
        // {
        //   title: '接收时间',
        //   dataIndex: 'number',
        //   align: 'left',
        //   ellipsis: true,
        //   width: 160,
        // },
        {
          title: '接班员',
          dataIndex: 'successor',
          ellipsis: true,
          align: 'left',
          width: 160,
        },
        // {
        //   title: '操作员',
        //   dataIndex: 'nameEn',
        //   ellipsis: true,
        //   align: 'left',
        //   width: 300,
        // },
        // {
        //   title: '操作日期',
        //   dataIndex: 'bloodLoad',
        //   ellipsis: true,
        //   align: 'left',
        //   width: 60,
        // },
        {
          title: '交班开始时间',
          dataIndex: 'shiftHandoverStartTime',
          ellipsis: true,
          align: 'left',
          width: 150,
        },
        {
          title: '交班结束时间',
          dataIndex: 'shiftHandoverEndTime',
          ellipsis: true,
          align: 'left',
          width: 150,
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
        shiftHandoverStartTime:
          record?.shiftHandoverStartTime && moment(record?.shiftHandoverStartTime),
        shiftHandoverEndTime: record?.shiftHandoverEndTime && moment(record?.shiftHandoverEndTime),
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
          shiftchangeDel({ id: record.id })
            .then((res) => {
              message.success(res.msg);
              yTable.table.dataRow = {};
              getTableData();
            })
            .catch((err) => {
              console.log('err-shiftchangeDel: ', err);
            });
        },
      });
    } else {
      message.error('请选中行');
    }
  };
  // 获取列表Table数据
  const getTableData = () => {
    const { keyWord, timeRange } = topFrom.getFieldsValue();
    const startTime = timeRange && timeRange[0] ? `${timeRange[0]} 00:00:00` : '';
    const endTime = timeRange && timeRange[1] ? `${timeRange[1]} 23:59:59` : '';
    const params = {
      handoverOfficer: keyWord,
      startTime,
      endTime,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    shiftchangeSelect(params)
      .then((res) => {
        yTable.table.dataSource = res?.data?.list || [];
        yTable.table.loading = false;
        yTable.table.pagination.current = res?.data?.pageNum;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('shiftchangeSelect---err', err);
      });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { shiftHandoverStartTime } = formData;
    let query = {
      ...modalForm.getFieldsValue(),
      shiftHandoverStartTime:
        shiftHandoverStartTime && moment(shiftHandoverStartTime).format('YYYY-MM-DD HH:mm:ss'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      shiftchangeAdd(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-shiftchangeAdd: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    } else {
      shiftchangeUpdate(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-shiftchangeUpdate: ', err);
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
          initialValues={{ shiftHandoverStartTime: moment() }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="交班员" name="handoverOfficer" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="接班员" name="successor" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="交班开始时间" name="shiftHandoverStartTime">
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={true}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="交班结束时间" name="shiftHandoverEndTime">
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={true}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="交班事宜"
                name="shiftHandover"
                rules={[{ required: true, message: '' }]}
              >
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
