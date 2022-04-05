import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable } from 'yunyi-component';
import { Form, Modal, Input, Row, Col, message, Divider, DatePicker, TimePicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  amusementAdd,
  amusementDel,
  amusementSelect,
  amusementUpdate,
} from '@/services/syntheticModule/amusement';
import { findValByKey, getDefaultOption } from '@/utils/common';
import { config } from '@/utils/const';
import { useTableHeight } from '@/utils/tableHeight';
import moment from 'moment';
import { excelExport, openModal } from '@/utils/ExcelExport';

const { pageSize, pageNum } = config;
const { TextArea } = Input;
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
        placeholder: '请输入负责人',
        sort: 2,
        style: { width: '200px' },
        pressEnter: (enter) => {
          getTableData();
        },
      },
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

      // {
      //   label: '日期',
      //   name: 'timeRange',
      //   config: {
      //     dateType: 'range',
      //     timeStart: moment().startOf('day'),
      //     timeEnd: moment().endOf('day'),
      //     showTime: false,
      //     onChange: (e) => {
      //       topRightFrom.setFieldsValue({ timeRange: e });
      //     },
      //     onChange: (e) => {
      //       topRightFrom.setFieldsValue({ timeRange: e });
      //       yRightTable.table.pagination.current = 1;
      //       getGermMasterData();
      //     },
      //   },
      //   style: { width: '220px' },
      //   sort: 1,
      // },
    ],
    btnArr: [
      {
        name: '查询',
        callback: () => {
          getTableData();
        },
        sort: 3,
        style: { marginRight: '15px' },
      },
      {
        name: '新增',
        type: 'primary',
        style: { marginRight: '15px' },
        sort: 4,
        callback: () => {
          addOrEdit('add', true);
        },
      },
      {
        name: '打印',
        type: 'primary',
        sort: 5,
        style: { marginRight: '15px' },
        callback: () => {
          // TODO:
          // if (!yTable.table.selectRows?.length) {
          //   message.warn('请勾选要打印的记录');
          //   return;
          // }
          // if (yTable.table.selectRows?.length > 1) {
          //   message.warn('每次只能勾选一条记录！');
          //   return;
          // }
          openModal({
            url: '/jmreport/view/671204086391820288',
          });
        },
      },
    ],
    layout: 'inline',
    form: topFrom,
    cls: 'opera',
    initialValues: {
      time: moment(),
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
          title: '小组活动',
          dataIndex: 'groupActivity',
          key: 'groupActivity',
          align: 'left',
          ellipsis: true,
          width: 60,
        },
        {
          title: '活动日期',
          dataIndex: 'activityDate',
          key: 'activityDate',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '活动开始时间',
          dataIndex: 'startTime',
          key: 'startTime',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '活动结束时间',
          dataIndex: 'endTime',
          key: 'endTime',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '活动地点',
          dataIndex: 'activitySite',
          key: 'activitySite',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '活动人数',
          dataIndex: 'number',
          key: 'number',
          align: 'left',
          ellipsis: true,
          width: 60,
        },
        {
          title: '活动内容',
          dataIndex: 'activeContent',
          key: 'activeContent',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '负责人',
          dataIndex: 'signature',
          key: 'signature',
          ellipsis: true,
          align: 'left',
          width: 80,
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
      scroll: { x: 1360, y: '100%' },
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
          yTable.table.pagination.current = page;
          yTable.table.pagination.pageSize = pageSize;
          getTableData();
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
        activityDate: record?.activityDate && moment(record?.activityDate),
        startTime: record?.startTime && moment(record?.startTime, 'HH:mm'),
        endTime: record?.endTime && moment(record?.endTime, 'HH:mm'),
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
    if (Object.getOwnPropertyNames(record).length) {
      Modal.confirm({
        title: '是否要删除该条数据',
        icon: <DeleteOutlined />,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        style: { padding: '30px' },
        onOk() {
          amusementDel({ ids: record.id })
            .then((res) => {
              message.success(res.msg);
              yTable.table.dataRow = {};
              getTableData();
            })
            .catch((err) => {
              console.log('err-amusementDel: ', err);
            });
        },
      });
    } else {
      message.error('请选中行');
    }
  };
  // 获取列表Table数据
  const getTableData = () => {
    const { keyWord, time } = topFrom.getFieldsValue();
    const params = {
      search: keyWord,
      groupActivityDate: time,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    amusementSelect(params)
      .then((res) => {
        yTable.table.dataSource = res?.data?.list || [];
        yTable.table.loading = false;
        yTable.table.pagination.current = res?.data?.pageNum;
        yTable.table.pagination.total = res?.data?.total;
        yTable.table.pagination.pageSize = res?.data?.pageSize;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('amusementSelect---err', err);
      });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { activityDate, startTime, endTime } = formData;
    const query = {
      ...modalForm.getFieldsValue(),
      activityDate: activityDate && moment(activityDate).format('YYYY-MM-DD'),
      startTime: startTime && moment(startTime).format('HH:mm'),
      endTime: endTime && moment(endTime).format('HH:mm'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      amusementAdd(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-amusementAdd: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    } else {
      amusementUpdate(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-amusementUpdate: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    }
  };
  // 初始化
  useEffect(() => {
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
          labelCol={{ flex: '110px' }}
          onFinish={saveModalInfo}
          initialValues={{ activityDate: moment(), startTime: moment(), endTime: moment() }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                label="小组活动"
                name="groupActivity"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="活动日期" name="activityDate">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="活动开始时间" name="startTime">
                <TimePicker
                  format="HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="活动结束时间" name="endTime">
                <TimePicker
                  format="HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="活动地点"
                name="activitySite"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="活动人数" name="number" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="活动内容" name="activeContent">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="负责人" name="signature" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
