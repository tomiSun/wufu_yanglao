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
import moment from 'moment';
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
        placeholder: '请输入交班员名称',
        sort: 1,
        style: { width: '200px' },
      },
    ],
    dateArr: [
      // {
      //   label: '时间',
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
          showTime: true,
          onChange: (e) => {
            topRightFrom.setFieldsValue({ timeRange: e });
          },
          onChange: (e) => {
            topRightFrom.setFieldsValue({ timeRange: e });
            yRightTable.table.pagination.current = 1;
            getBloodMasterData();
          },
        },
        style: { width: '220px' },
        sort: 2,
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
  // {key:'1',value:'2'}
  // [{key:'1',value:'2'},{key:'1',value:'2'}]
  // [{key:'1',value:'2'},{key:'1',value:'2'}]
  // ['1001','1003']
  // let res = {
  //   '1001':[
  //     {key:'001',name:'男',value:'001',label:'男'},
  //     {key:'002',name:'女',value:'001',label:'男'}
  //   ],
  //   '1002':[{key:'002',name:'男',value:'001',label:'男'}]
  // }
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
          width: 80,
        },
        {
          title: '交班结束时间',
          dataIndex: 'shiftHandoverEndTime',
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
                查看
              </a>

              <Divider type="vertical" />
              <a
                onClick={() => {
                  addOrEdit('edit', true, record);
                }}
              >
                编辑
              </a>

              {/* <Divider type="vertical" />
              <a
                onClick={() => {
                  del(record);
                }}
              >
                删除
              </a> */}
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
          labelCol={{ flex: '150px' }}
          onFinish={saveModalInfo}
          initialValues={{ isCross: false, isMelt: false }}
        >
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
                <DatePicker format="YYYY-MM-DD" showTime={true} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="交班结束时间" name="shiftHandoverEndTime">
                <DatePicker format="YYYY-MM-DD" showTime={true} style={{ width: '100%' }} />
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
