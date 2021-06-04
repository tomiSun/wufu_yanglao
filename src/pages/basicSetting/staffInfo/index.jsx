import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable, Seltopt } from 'yunyi-component';
import { Form, Modal, Input, Row, Col, Radio, InputNumber, message, Button } from 'antd';
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
        placeholder: '请输入内容',
        sort: 1,
        style: { width: 250, float: 'right' },
      },
    ],
    btnArr: [
      {
        name: '新增',
        type: 'primary',
        style: { position: 'absolute', left: '15px' },
        callback: () => {
          addOrEditBloondData('add', true);
        },
      },
      {
        name: '编辑',
        style: { position: 'absolute', left: '97px' },
        callback: () => {
          addOrEditBloondData('edit', true);
        },
      },
      {
        name: '删除',
        type: 'primary',
        style: { position: 'absolute', left: '179px' },
        callback: () => {
          deleteBloondData();
        },
      },
      {
        name: '刷新',
        style: { position: 'absolute', left: '257px' },
        callback: () => {
          refreshData();
        },
      },
    ],
    layout: 'inline',
    form: topFrom,
    styles: { marginTop: '10px', textAlign: 'right', float: 'right' },
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
      dataSource: [{}],
      columns: [
        {
          title: '编码',
          dataIndex: 'number',
          align: 'left',
          ellipsis: true,
          width: 60,
        },
        {
          title: '类别',
          dataIndex: 'typeName',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '名称',
          dataIndex: 'bloodName',
          ellipsis: true,
          align: 'left',
        },
        {
          title: '简称',
          dataIndex: 'nameEn',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'left',
          ellipsis: true,
          width: 60,
          render: (text, record, index) => {
            return findValByKey(yTable.table.basic['1043'], 'key', text, 'name');
          },
        },
        {
          title: '系数',
          dataIndex: 'bloodLoad',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '有效天数',
          dataIndex: 'effectiveDay',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '预警天数',
          dataIndex: 'alarmDay',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '拼音码',
          dataIndex: 'pinyinCode',
          ellipsis: true,
          align: 'left',
          width: 90,
        },
        {
          title: '五笔码',
          dataIndex: 'wubiCode',
          ellipsis: true,
          align: 'left',
          width: 90,
        },
        {
          title: '自定义码',
          dataIndex: 'customCode',
          ellipsis: true,
          align: 'left',
          width: 90,
        },
        {
          title: '交叉标志',
          dataIndex: 'isCross',
          align: 'left',
          ellipsis: true,
          width: 80,
          render: (text, record, info) => (text === 1 ? '是' : '否'),
        },
        {
          title: '交叉方法',
          dataIndex: 'crossMethodName',
          ellipsis: true,
          align: 'left',
          width: 100,
        },
        {
          title: '融化标志',
          dataIndex: 'isMelt',
          align: 'left',
          ellipsis: true,
          width: 80,
          render: (text, record, info) => (text === 1 ? '是' : '否'),
        },
      ],
      key: Math.random(),
      scroll: { x: 1360, y: '100%' },
      dataRow: {},
      rowKey: 'id',
      pagination: false,
      basic: {},
      oClick: (count) => {
        yTable.table.dataRow = count;
        setYTable({ ...yTable });
      },
      selectInfo: (info) => {
        yTable.table.dataRow = info;
        setYTable({ ...yTable });
        addOrEditBloondData('edit', true);
      },
    },
  });

  // 判断新增 / 编辑
  const [modeType, setModeType] = useState({
    type: null,
    show: false,
  });

  // 新增 / 编辑
  const addOrEditBloondData = (query, query1) => {
    if (!Object.getOwnPropertyNames(yTable.table.dataRow).length && query === 'edit')
      return message.error('请选中行');
    modalForm.resetFields();
    if (query === 'edit') {
      modalForm.setFieldsValue({
        ...yTable.table.dataRow,
        isCross: !!yTable.table.dataRow.isCross ? true : false,
        isMelt: !!yTable.table.dataRow.isMelt ? true : false,
      });
    } else {
      // 选择框默认值
      modalForm.setFieldsValue({
        typeName: getDefaultOption(basic['1041'])?.name,
        typeCode: getDefaultOption(basic['1041'])?.key,
        unit: getDefaultOption(basic['1043'])?.key,
      });
    }
    modeType.type = query;
    modeType.show = query1;
    setModeType({ ...modeType });
  };

  // 删除
  const deleteBloondData = () => {
    if (!!Object.getOwnPropertyNames(yTable.table.dataRow).length) {
      Modal.confirm({
        title: '是否要删除该条数据',
        icon: <DeleteOutlined />,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        style: { padding: '30px' },
        onOk() {
          // delBloodTableData({ id: yTable.table.dataRow.id }).then((response) => {
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
    yTable.table.loading = true;
    setYTable({ ...yTable });
    if (modeType.type === 'add') {
      // insertBloodType(query).then((response) => {
      //   message.success('新增成功');
      //   addOrEditBloondData('', false);
      //   getTableData();
      // });
    } else {
      // updateBloodType({ ...query, id: yTable.table.dataRow.id }).then((response) => {
      //   message.success('编辑成功');
      //   addOrEditBloondData('', false);
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
        onCancel={() => addOrEditBloondData('', false)}
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
              <Form.Item label="编号" name="number" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="成份类别" name="typeName" rules={[{ required: true, message: '' }]}>
                <Seltopt
                  selectArr={basic['1041']}
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
              <Form.Item
                label="成份名称"
                name="bloodName"
                rules={[{ required: true, message: '' }]}
              >
                <Input
                  placeholder="请输入"
                  onChange={(e) => {
                    let fiveStrokeCode = makeWb(e.target.value);
                    let pinyinCode = pinyin.getCamelChars(e.target.value);
                    modalForm.setFieldsValue({ wubiCode: fiveStrokeCode, pinyinCode: pinyinCode });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="简称" name="nameEn">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="有效天数"
                name="effectiveDay"
                rules={[{ required: true, message: '' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} precision={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="单位" name="unit" rules={[{ required: true, message: '' }]}>
                <Seltopt
                  selectArr={basic['1043']}
                  sWidth="100%"
                  callback={(cb) => {
                    modalForm.setFieldsValue({ unit: cb });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="预警天数" name="alarmDay" rules={[{ required: true, message: '' }]}>
                <InputNumber min={0} style={{ width: '100%' }} precision={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="换算系数"
                name="bloodLoad"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="是否交叉"
                name="isCross"
                validateTrigger="onBlur"
                rules={[{ required: true, message: '' }]}
              >
                <Radio.Group
                  value={'isCross'}
                  onChange={(cb) => {
                    if (cb.target.value) {
                      setIsCross(true);
                    } else {
                      setIsCross(false);
                    }
                  }}
                >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="交叉方法"
                name="crossMethod"
                validateTrigger="onBlur"
                rules={[{ required: isCross ? true : false, message: '请选择' }]}
              >
                <Seltopt
                  selectArr={basic['1042']}
                  sWidth="100%"
                  callback={(cb) => {
                    modalForm.setFieldsValue({ crossMethod: cb });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="是否融化" name="isMelt" rules={[{ required: true, message: '' }]}>
                <Radio.Group
                  value={'isMelt'}
                  onChange={(cb) => {
                    if (cb.target.value) setIsMelt(true);
                    else setIsMelt(false);
                  }}
                >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="融化时间"
                name="meltingTime"
                rules={[{ required: isMelt, message: '请选择' }]}
              >
                <Input placeholder="请输入" suffix="分钟" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="拼音码" name="pinyinCode">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="五笔码" name="wubiCode">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="自定义码" name="customCode">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="外部编码" name="externalCode">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="系数" name="externalCoefficient">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
