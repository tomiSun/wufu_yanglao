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
  Rate,
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
import { useTableHeight } from '@/utils/tableHeight';
import { excelExport, openModal } from '@/utils/ExcelExport';
const { pageSize, pageNum } = config;
const { TextArea } = Input;
export default () => {
  // 获取表格高度
  // const tableRef = useRef(null);
  // const tableHeight = useTableHeight(tableRef);
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
        style: { marginRight: '15px' },
        sort: 3,
        callback: () => {
          addOrEdit('add', true);
        },
      },
      {
        name: '打印',
        type: 'primary',
        sort: 4,
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
          title: '护工编号',
          dataIndex: 'number',
          align: 'left',
          ellipsis: true,
          width: 60,
        },
        {
          title: '姓名',
          dataIndex: 'typeName',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '性别',
          dataIndex: 'bloodName',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '出生日期',
          dataIndex: 'nameEn',
          ellipsis: true,
          align: 'left',
          width: 150,
        },
        {
          title: '年龄',
          dataIndex: 'unit',
          align: 'left',
          ellipsis: true,
          width: 60,
          render: (text, record, index) => {
            return findValByKey(yTable.table.basic['1043'], 'key', text, 'name');
          },
        },
        {
          title: '身份证号',
          dataIndex: 'bloodLoad',
          ellipsis: true,
          align: 'left',
          width: 160,
        },
        {
          title: '联系方式',
          dataIndex: 'effectiveDay',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '联系地址',
          dataIndex: 'alarmDay',
          ellipsis: true,
          align: 'left',
          width: 180,
        },
        {
          title: '状态',
          dataIndex: 'isCross',
          align: 'left',
          ellipsis: true,
          width: 80,
          render: (text, record, info) => (text === 1 ? '启用' : '停用'),
        },
        {
          title: '操作',
          key: 'opera',
          align: 'center',
          width: 100,
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
        showQuickJumper: false,
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
        isCross: !!record.isCross,
        isMelt: !!record.isMelt,
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
    if (Object.getOwnPropertyNames(record).length) {
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
    const query = {
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
    <div className={styles.bloodComposition}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>老人（家属）满意度测评表</div>

      <div style={{}}>
        <p>尊敬的长辈（家属）：</p>
        <p style={{ textIndent: '2em' }}>
          您好！为了更好的为您提供更优质的服务，现向您征求意见，请根据您的实际感受作答，勾选相应的选项，或在意见和建议栏填写内容，感谢的您的支持和配合
        </p>
      </div>
      <Form
        name="basic"
        layout="vertical"
        form={modalForm}
        // labelCol={{ flex: '90px' }}
        onFinish={saveModalInfo}
        initialValues={{ isCross: false, isMelt: false }}
      >
        <Row>
          {/* <Col span={24}>
              <Form.Item name="rate" label="1,您对本院生活环境满意吗？（设备，卫生周边）">
                <Rate />
              </Form.Item>
            </Col> */}
          <Col span={24}>
            <Form.Item
              name="radio1"
              label="1,您对本院生活环境满意吗？（设备，卫生周边）"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="radio2"
              label="2,您对护理质量满意吗？（态度，操作，个人卫生）"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="radio3"
              label="3,您对本院客服人员院管理人员满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="radio4"
              label="4,您对医疗服务满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="radio5"
              label="5,您对本院组织的各项日常文化娱乐活动满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="radio6"
              label="6,您对现在的饮食满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="radio7"
              label="7,您对本院日常事情处理时间，处理态度，处理结果满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="radio8"
              label="8,您对本院各部门综合服务水平满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Radio value="3">满意（3）</Radio>
                <Radio value="2">较满意（2）</Radio>
                <Radio value="1">不满意（1）</Radio>
                <Radio value="0">说不出（0）</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            总计？？？
            {/* <Form.Item label="总计" name="total">
                <Input placeholder="请输入" />
              </Form.Item> */}
          </Col>

          <Col span={24}>
            <Form.Item label="您的其他意见和建议" name="remark">
              <TextArea placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary">提交</Button>
      </div>
    </div>
  );
};
