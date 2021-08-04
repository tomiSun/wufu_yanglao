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
  recordAdd,
  recordDel,
  recordSelect,
  recordUpdate,
} from '@/services/syntheticModule/record';
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
        placeholder: '请输入捐款单位（个人）',
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
      dataSource: [{ id: 1 }],
      columns: [
        {
          title: '日期',
          dataIndex: 'donationDate',
          ellipsis: true,
          align: 'left',
          width: 150,
        },
        {
          title: '捐款单位（个人）',
          dataIndex: 'donor',
          align: 'left',
          ellipsis: true,
          width: 160,
        },

        {
          title: '捐款人意见',
          dataIndex: 'donorWillingness',
          ellipsis: true,
          align: 'left',
          width: 160,
        },
        {
          title: '钱款（金额）',
          dataIndex: 'contributions',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '物品',
          dataIndex: 'donationItem',
          align: 'left',
          ellipsis: true,
          width: 300,
          children: [
            {
              title: '名称',
              dataIndex: 'donationItem',
              key: 'donationItem',
              width: 100,
            },
            {
              title: '数量',
              dataIndex: 'amount',
              key: 'amount',
              width: 100,
            },
            {
              title: '估价',
              dataIndex: 'valuation',
              key: 'valuation',
              width: 100,
            },
          ],
        },
        {
          title: '捐赠物处理',
          dataIndex: 'donationItemsDisposal',
          ellipsis: true,
          align: 'left',
          width: 100,
        },
        {
          title: '经办责任人',
          dataIndex: 'personInCharge',
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
      // selectInfo: (info) => {
      //   yTable.table.dataRow = info;
      //   setYTable({ ...yTable });
      //   addOrEdit('edit', true);
      // },
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
        donationDate: record?.donationDate && moment(record?.donationDate),
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
          recordDel({ ids: record.id })
            .then((res) => {
              message.success(res.msg);
              yTable.table.dataRow = {};
              getTableData();
            })
            .catch((err) => {
              console.log('err-recordDel: ', err);
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
    let params = {
      search: keyWord,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    recordSelect(params)
      .then((res) => {
        yTable.table.dataSource = res?.data?.list || [];
        yTable.table.loading = false;
        // yTable.table.pagination.current = res?.data?.pageNum;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('recordSelect---err', err);
      });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { donationDate } = formData;
    let query = {
      ...modalForm.getFieldsValue(),
      donationDate: donationDate && moment(donationDate).format('YYYY-MM-DD'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      recordAdd(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-recordAdd: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    } else {
      recordUpdate(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-recordUpdate: ', err);
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
          labelCol={{ flex: '140px' }}
          onFinish={saveModalInfo}
          initialValues={{ donationDate: moment() }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={24}>
              <Form.Item
                label="捐赠单位（个人）"
                name="donor"
                rules={[{ required: true, message: '' }]}
              >
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="捐款人意见" name="donorWillingness">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="日期" name="donationDate">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="钱款（金额）"
                name="contributions"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="捐赠物名称" name="donationItem">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="捐赠物数量" name="amount" rules={[{ required: true, message: '' }]}>
                <InputNumber placeholder="请输入" min="1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="捐赠物估价"
                name="valuation"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="捐赠物处理" name="donationItemsDisposal">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="经办责任人"
                name="personInCharge"
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
