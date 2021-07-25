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
// import {
//   getBloodTableData,
//   delBloodTableData,
//   insertBloodType,
//   updateBloodType,
// } from '@/services/blood/bloodcomposition';
// import { getBasicData } from '@/services/basicData/basic';
import { findValByKey, getDefaultOption } from '@/utils/common';
import { makeWb, pinyin } from 'yunyi-convert';
import { config } from '@/utils/const';
const { pageSize, pageNum } = config;
import { useTableHeight } from '@/utils/tableHeight';
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
        placeholder: '请输入',
        sort: 1,
        // style: {  },
      },
    ],
    btnArr: [
      {
        name: '查询',
        callback: () => {},
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
      // {
      //   name: '编辑',
      //   style: { position: 'absolute', left: '97px' },
      //   callback: () => {
      //     addOrEdit('edit', true);
      //   },
      // },
      // {
      //   name: '删除',
      //   type: 'danger',
      //   style: { position: 'absolute', left: '179px' },
      //   callback: () => {
      //     del();
      //   },
      // },
      // {
      //   name: '刷新',
      //   style: { position: 'absolute', left: '257px' },
      //   callback: () => {
      //     refreshData();
      //   },
      // },
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

  // 动态更改form校验状态
  const [isCross, setIsCross] = useState(false);
  const [isMelt, setIsMelt] = useState(false);

  // table模块
  const [yTable, setYTable] = useState({
    table: {
      bordered: true,
      loading: false,
      dataSource: [{ id: 1 }],
      columns: [
        {
          title: '兴趣小组',
          dataIndex: 'number',
          align: 'left',
          ellipsis: true,
          width: 60,
        },
        {
          title: '日期',
          dataIndex: 'typeName',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '活动时间',
          dataIndex: 'bloodName',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '活动地点',
          dataIndex: 'nameEn',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '活动人数',
          dataIndex: 'unit',
          align: 'left',
          ellipsis: true,
          width: 60,
          render: (text, record, index) => {
            return findValByKey(yTable.table.basic['1043'], 'key', text, 'name');
          },
        },
        {
          title: '活动内容',
          dataIndex: 'bloodLoad',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '负责人',
          dataIndex: 'effectiveDay',
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
        pageSize: 10,
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
      selectInfo: (info) => {
        yTable.table.dataRow = info;
        setYTable({ ...yTable });
        addOrEdit('edit', true);
      },
    },
  });

  // 判断新增 / 编辑
  const [modeType, setModeType] = useState({
    type: null,
    show: false,
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
        isCross: !!record.isCross ? true : false,
        isMelt: !!record.isMelt ? true : false,
      });
    } else {
      // 选择框默认值
      modalForm.setFieldsValue({
        typeName: getDefaultOption(basic['1041'])?.name,
        typeCode: getDefaultOption(basic['1041'])?.key,
        unit: getDefaultOption(basic['1043'])?.key,
      });
    }
    changeModal(type, visible);
  };
  // 修改弹窗配置
  const changeModal = (type, visible) => {
    modeType.type = type;
    modeType.show = visible;
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
          // delBloodTableData({ id: record.id }).then((response) => {
          //   message.success('删除成功');
          //   yTable.table.dataRow = {};
          //   yTable.table.loading = true;
          //   setYTable({ ...yTable });
          //   getTableData();
          // });
        },
      });
    } else {
      message.error('请选中行数');
    }
  };
  // 重置密码
  const resetPassWord = (record) => {
    if (!!Object.getOwnPropertyNames(record).length) {
      Modal.confirm({
        title: '您确定要重置密码为000000吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        style: { padding: '30px' },
        onOk() {
          // delBloodTableData({ id: record.id }).then((response) => {
          //   message.success('删除成功');
          //   yTable.table.dataRow = {};
          //   yTable.table.loading = true;
          //   setYTable({ ...yTable });
          //   getTableData();
          // });
        },
      });
    } else {
      message.error('请选中行数');
    }
  };

  // 刷新
  const refreshData = () => {
    yTable.table.loading = true;
    setYTable({ ...yTable });
    getTableData();
  };

  // 获取列表Table数据
  const getTableData = () => {
    // getBloodTableData({ keyWord: topFrom.getFieldsValue().keyWord })
    //   .then((response) => {
    //     response.data?.map((items) => (items.key = items.id));
    //     yTable.table.key = Math.random();
    //     yTable.table.loading = false;
    //     yTable.table.dataRow = {};
    //     yTable.table.dataSource = response.data;
    //     setYTable({ ...yTable });
    //   })
    //   .catch(() => {
    //     yTable.table.loading = false;
    //     yTable.table.dataSource = [];
    //     setYTable({ ...yTable });
    //   });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = () => {
    let query = {
      ...modalForm.getFieldsValue(),
      typeCode: findValByKey(basic['1041'], 'name', modalForm.getFieldsValue().typeName, 'key'),
    };
    console.log('query: ', query);
    yTable.table.loading = true;
    setYTable({ ...yTable });
    if (modeType.type === 'add') {
      // insertBloodType(query).then((response) => {
      //   message.success('新增成功');
      //   addOrEdit('', false);
      //   getTableData();
      // });
    } else {
      // updateBloodType({ ...query, id: yTable.table.dataRow.id }).then((response) => {
      //   message.success('编辑成功');
      //   addOrEdit('', false);
      //   getTableData();
      // });
    }
  };

  // 获取字典数据
  const getDictionaryData = () => {
    // getBasicData(['1043', '1042', '1041']).then((response) => {
    //   setBasic(response.data);
    //   yTable.table.basic = response.data;
    //   setYTable({ ...yTable });
    // });
  };

  useEffect(() => {
    modalForm.validateFields(['crossMethod']);
  }, [isCross]);

  useEffect(() => {
    modalForm.validateFields(['meltingTime']);
  }, [isMelt]);

  // 初始化
  useEffect(() => {
    // getDictionaryData();
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
        visible={modeType.show}
        onOk={() => {
          modalForm.submit();
        }}
        onCancel={() => changeModal('', false)}
      >
        <Form
          name="basic"
          form={modalForm}
          labelCol={{ flex: '90px' }}
          onFinish={saveModalInfo}
          initialValues={{ isCross: false, isMelt: false }}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="员工编号" name="number" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="number" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="性别" name="typeName" rules={[{ required: false, message: '' }]}>
                <Seltopt
                  selectArr={[]}
                  sWidth="100%"
                  callback={(cb) => {
                    modalForm.setFieldsValue({
                      typeName: findValByKey(basic['1041'], 'key', cb, 'name'),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="生日" name="collectionTime">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="年龄" name="nameEn">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="身份证号" name="nameEn">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系方式" name="nameEn">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="联系地址" name="remark">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                <Checkbox>
                  <span className={styles.labeltext}>启用</span>
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};