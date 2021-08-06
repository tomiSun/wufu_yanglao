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
  Select,
} from 'antd';
const { confirm } = Modal;
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import {
  employeeAdd,
  employeeDel,
  employeeSelect,
  employeeUpdate,
  employeeesetPassword,
} from '@/services/basicSetting/staffInfo';
import { findValByKey, getDefaultOption } from '@/utils/common';
import { makeWb, pinyin } from 'yunyi-convert';
import { config } from '@/utils/const';
const { pageSize, pageNum } = config;
import { useTableHeight } from '@/utils/tableHeight';
import moment from 'moment';
const { TextArea } = Input;
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  // 基础字典数据
  const [basic, setBasic] = useState({});
  // 上部搜索searchForm模块
  const [topFrom] = Form.useForm();
  const searchTopForm = {
    inputArr: [
      {
        name: 'keyWord',
        placeholder: '请输入',
        sort: 1,
        style: { width: '200px' },
        pressEnter: (enter) => {
          getTableData();
        },
        // style: {  },
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
          changeModal('add', true);
        },
      },
    ],
    layout: 'inline',
    form: topFrom,
    cls: 'opera',
    // styles: { marginTop: '10px' },
  };
  // table模块
  const [yTable, setYTable] = useState({
    table: {
      bordered: true,
      loading: false,
      dataSource: [{ id: 1 }],
      columns: [
        {
          title: '员工编号',
          dataIndex: 'employeeCode',
          align: 'left',
          ellipsis: true,
          width: 60,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '性别',
          dataIndex: 'sex',
          ellipsis: true,
          align: 'left',
          width: 60,
          render: (text, record, index) => {
            return findValByKey(yTable.table.basic['0001'], 'value', text, 'label');
          },
        },
        {
          title: '出生日期',
          dataIndex: 'birthday',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          align: 'left',
          ellipsis: true,
          width: 60,
        },
        {
          title: '身份证号',
          dataIndex: 'idCard',
          ellipsis: true,
          align: 'left',
          width: 60,
        },
        {
          title: '联系方式',
          dataIndex: 'contactNumber',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '联系地址',
          dataIndex: 'address',
          ellipsis: true,
          align: 'left',
          width: 180,
        },
        {
          title: '是否为管理员',
          dataIndex: 'isAdministrator',
          align: 'left',
          ellipsis: true,
          width: 100,
          render: (text, record, info) => (text === 1 ? '是' : '否'),
        },
        {
          title: '状态',
          dataIndex: 'useFlag',
          align: 'left',
          ellipsis: true,
          width: 50,
          render: (text, record, info) => (text === 1 ? '启用' : '停用'),
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
                  changeModal('edit', true, record);
                }}
              >
                编辑
              </a>

              <Divider type="vertical" />
              <a
                onClick={() => {
                  delInfo(record);
                }}
              >
                删除
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  resetPassWord(record);
                }}
              >
                重置密码
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
    },
  });
  // modal配置项
  const [modalForm] = Form.useForm();
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '员工信息',
    type: '',
    continue: false,
    loading: false,
  });
  // 打开弹窗
  const changeModal = (type, visible, record) => {
    modalForm.resetFields();
    setModalConfig({
      ...modalConfig,
      visible: visible,
      title:
        type === 'add'
          ? '新增员工信息'
          : type === 'edit'
          ? '编辑员工信息'
          : type === 'detail'
          ? '查看员工信息'
          : '员工信息',
      type: type,
    });
    if (type === 'add') {
      modalForm.setFieldsValue({
        dictTypeCode: yTable.table.selectedNode?.dictTypeCode,
        dictTypeName: yTable.table.selectedNode?.dictTypeName,
      });
    }
    if (type === 'edit') {
      modalForm.setFieldsValue({
        ...record,
        birthday: record?.birthday && moment(record?.birthday),
      });
    }
  };
  // 保存信息数据
  const saveInfoData = async () => {
    const formData = await modalForm.validateFields();
    const params = {
      ...formData,
      useFlag: ~~formData?.useFlag,
      birthday: formData?.birthday && moment(formData?.birthday).format('YYYY-MM-DD'),
    };
    modalConfig.loading = true;
    setModalConfig({ ...modalConfig });
    if (modalConfig.type === 'add') {
      employeeAdd(params)
        .then((res) => {
          message.success(res?.msg);
          // 刷新字典类别数据
          getTableData();
          modalConfig.visible = false;
          modalConfig.loading = false;
          setModalConfig({ ...modalConfig });
        })
        .catch((err) => {
          console.log('err-logining: ', err);
          modalConfig.loading = false;
          setModalConfig({ ...modalConfig });
        });
    } else if (modalConfig.type === 'edit') {
      employeeUpdate(params)
        .then((res) => {
          message.success(res?.msg);
          // 刷新字典类别数据
          getTableData();
          modalConfig.visible = false;
          modalConfig.loading = false;
          setModalConfig({ ...modalConfig });
        })
        .catch((err) => {
          console.log('err-logining: ', err);
          modalConfig.loading = false;
          setModalConfig({ ...modalConfig });
        });
    }
  };
  // 获取右侧表格数据
  const getTableData = () => {
    const { keyWord } = topFrom.getFieldsValue();
    let params = {
      keyWord: keyWord,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    employeeSelect(params)
      .then((res) => {
        yTable.table.dataSource = res?.data?.list || [];
        yTable.table.loading = false;
        // yTable.table.pagination.current = res?.data?.pageNum;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('dictTypeSelect---err', err);
      });
  };
  // 删除字典
  const delInfo = (record) => {
    confirm({
      title: '删除',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      content: `您确定删除吗？`,
      centered: true,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        employeeDel({ ids: record?.id || '' })
          .then((res) => {
            message.success(res?.msg);
            getTableData();
          })
          .catch((err) => {
            console.log('deleteType---err', err);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
          let query = { employeeCode: record.employeeCode };
          employeeesetPassword(query)
            .then((res) => {
              message.success(res?.msg);
              getTableData();
            })
            .catch((err) => {
              console.log('deleteType---err', err);
            });
        },
      });
    } else {
      message.error('请选中行数');
    }
  };
  // 获取字典数据
  const getDictionaryData = () => {
    dictTypeSelectPullDown(['0001']).then((response) => {
      setBasic(response.data);
      yTable.table.basic = response.data;
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
        width={720}
        maskClosable={false}
        title={modalConfig.title}
        visible={modalConfig.visible}
        centered
        forceRender
        onOk={() => {
          modalForm.submit();
        }}
        confirmLoading={modalConfig.loading}
        onCancel={() => changeModal('', false)}
        okButtonProps={{ disabled: modalConfig.type === 'detail' }}
        cancelButtonProps={{ disabled: modalConfig.type === 'detail' }}
      >
        <Form
          form={modalForm}
          className={styles.modalform}
          onFinish={saveInfoData}
          labelCol={{ flex: '100px' }}
          initialValues={{ isAdministrator: 0, useFlag: 1 }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item
                label="员工编号"
                name="employeeCode"
                rules={[{ required: true, message: '' }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="name" rules={[{ required: true, message: '' }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="性别" name="sex" rules={[{ required: false, message: '' }]}>
                {/* <Seltopt
                  selectArr={basic['0001'] || []}
                  sWidth="100%"
                  callback={(cb) => {
                    modalForm.setFieldsValue({
                      sex: cb,
                      // sexName: findValByKey(basic['1041'], 'key', cb, 'name'),
                    });
                  }}
                /> */}
                <Select placeholder="请选择" options={basic['0001'] || []}></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="生日" name="birthday">
                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="年龄" name="age">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="身份证号" name="idCard">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系方式" name="contactNumber">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="联系地址" name="address">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="是否为管理员" name="isAdministrator">
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="useFlag" valuePropName="checked" style={{ marginLeft: 8 }}>
                <Checkbox>
                  <span className={styles.labeltext}>停用</span>
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
