import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable, Seltopt } from 'yunyi-component';
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
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  complainAdd,
  complainDel,
  complainSelect,
  complainUpdate,
} from '@/services/syntheticModule/complain';
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
        placeholder: '请输入会议（投诉）主题',
        sort: 1,
        style: { width: '200px' },
        pressEnter: (enter) => {
          getTableData();
        },
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
        style: { marginRight: '15px' },
        sort: 3,
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
          // openModal({
          //   url: '/jmreport/view/655288045090426880',
          //   params: { businessNo: yTable.table.selectRows[0].businessNo || '' },
          // });
        },
      },
    ],
    layout: 'inline',
    form: topFrom,
    cls: 'opera',
    // styles: { marginTop: '10px' },
    getInfoData: (value) => {
      refreshData();
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
          title: '会议（投诉）日期',
          dataIndex: 'complaintDate',
          ellipsis: true,
          align: 'left',
          width: 150,
        },
        {
          title: '参加（投诉）人员',
          dataIndex: 'complaintPeople',
          align: 'left',
          ellipsis: true,
          width: 160,
        },
        {
          title: '缺席人员',
          dataIndex: 'absentee',
          align: 'left',
          ellipsis: true,
          width: 160,
        },
        {
          title: '会议（投诉）主题',
          dataIndex: 'theme',
          align: 'left',
          ellipsis: true,
          width: 160,
        },
        {
          title: '主持人',
          dataIndex: 'host',
          ellipsis: true,
          align: 'left',
          width: 160,
        },
        {
          title: '意见和建议',
          dataIndex: 'suggestion',
          ellipsis: true,
          align: 'left',
          width: 300,
        },
        {
          title: '处理措施',
          dataIndex: 'treatment',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '落实情况',
          dataIndex: 'workable',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '责任人',
          dataIndex: 'person_in_charge',
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
          console.log('changePage----', page, pageSize);
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
        complaintDate: record?.complaintDate && moment(record?.complaintDate),
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
          complainDel({ ids: record.id })
            .then((res) => {
              message.success(res.msg);
              yTable.table.dataRow = {};
              getTableData();
            })
            .catch((err) => {
              console.log('err-complainDel: ', err);
            });
        },
      });
    } else {
      message.error('请选中行');
    }
  };
  // 获取列表Table数据
  const getTableData = () => {
    const { keyWord } = topFrom.getFieldsValue();
    const params = {
      search: keyWord,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    complainSelect(params)
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
        console.log('complainSelect---err', err);
      });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { complaintDate } = formData;
    const query = {
      ...modalForm.getFieldsValue(),
      complaintDate: complaintDate && moment(complaintDate).format('YYYY-MM-DD'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      complainAdd(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-complainAdd: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    } else {
      complainUpdate(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-complainUpdate: ', err);
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
          labelCol={{ flex: '160px' }}
          onFinish={saveModalInfo}
          initialValues={{ complaintDate: moment() }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="会议（投诉）日期" name="complaintDate">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="主持人" name="host" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="参加（投诉）人员"
                name="complaintPeople"
                rules={[{ required: true, message: '' }]}
              >
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="缺席人员" name="absentee">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="会议（投诉）主题" name="theme">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="意见和建议" name="suggestion">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="处理措施" name="treatment">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="落实情况" name="workable">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="责任人"
                name="person_in_charge"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
