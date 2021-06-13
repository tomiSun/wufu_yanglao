import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Tree,
  message,
  InputNumber,
} from 'antd';
import { makeWb, pinyin } from 'yunyi-convert';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchForm, YTable } from 'yunyi-component';
import styles from './index.less';
import { useTableHeight } from '@/utils/tableHeight';

const { confirm } = Modal;
const { TextArea } = Input;
const { DirectoryTree } = Tree;
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  // 树数据
  const [treeData, setTreeData] = useState([
    {
      title: '字典类别1',
      key: '0-0-0-0',
      disableCheckbox: true,
    },
    {
      title: '字典类别2',
      key: '0-0-0-1',
    },
  ]);
  // 树形节点选中
  const treeSelect = async (selectedKeys, info) => {
    console.log('selectedKeys, info: ', selectedKeys, info);
  };
  // yTable
  const [yTable, setYTable] = useState({
    table: {
      bordered: true,
      loading: false,
      scroll: { y: '100%' },
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => {
          return `共 ${total} 条`;
        },
        onChange: (page, pageSize) => {
          yTable.table.pagination.current = page;
          yTable.table.pagination.pageSize = pageSize;
          getTableData();
        },
      },
      dataSource: [{}],
      dataRow: {},
      selectedNodes: {},
      zdxxData: {},
      columns: [
        {
          title: '排序号',
          dataIndex: 'sort',
          key: 'sort',
          align: 'center',
          width: 60,
          render: (text, record, index) => index + 1,
        },
        {
          title: '类别编码',
          dataIndex: 'typeCode',
          key: 'typeCode',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '类别名称',
          dataIndex: 'typeName',
          key: 'typeName',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '字典名称',
          dataIndex: 'dictName',
          key: 'dictName',
          ellipsis: true,
          width: 200,
        },
        {
          title: '字典编码',
          dataIndex: 'dictCode',
          key: 'dictCode',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '五笔码',
          dataIndex: 'customCode',
          key: 'customCode',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '拼音码',
          dataIndex: 'customCode',
          key: 'customCode',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 50,
          align: 'center',
          // render: (text, record) => <Switch checked={record.status} size="small" disabled/>,
          render: (text, record) => (record.status ? '启用' : '停用'),
        },
        {
          title: '操作',
          key: 'opera',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <div className={styles.opera}>
              {yTable.table.selectedNodes.status === '1' ? (
                <span style={{ color: '#d9d9d9' }}>编辑</span>
              ) : (
                <a
                  onClick={() => {
                    editInfo(text, record);
                  }}
                >
                  编辑
                </a>
              )}

              <Divider type="vertical" />
              <a onClick={() => delInfo(text, record)}>删除</a>
            </div>
          ),
        },
      ],
    },
  });
  const [formTopRight] = Form.useForm();
  const topRightForm = {
    inputArr: [
      {
        label: '',
        name: 'name',
        placeholder: '请输入',
        sort: 1,
        style: {
          width: 200,
        },
      },
    ],
    btnArr: [
      {
        name: '查询',
        type: 'primary',
        htmlType: 'submit',
        bconfig: {},
      },
      {
        name: '新增',
        type: 'primary',
        bconfig: {},
        style: {
          marginLeft: 8,
        },
        callback: () => {
          changeModal('add', true);
        },
      },
    ],
    layout: 'inline',
    form: formTopRight,
    cls: styles.topRightForm,
    getInfoData: (value) => {
      yTable.table.selectedNodes?.id && ((yTable.table.pagination.current = 1), getTableData());
    },
  };
  // modalForm
  const [modalForm] = Form.useForm();
  const [modalFormSort] = Form.useForm();
  const [treeSearchForm] = Form.useForm();
  const [details, setDetails] = useState({}); // 弹窗 - 字典明细详情

  // modal配置项
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '字典明细',
    type: '',
    continue: false,
  });
  const [modalSortConfig, setModalSortConfig] = useState({
    visible: false,
    title: '字典类别',
    type: '',
    continue: false,
  });

  // 统一接口 获取类型下的分类列表
  const queryTypeListServices = () => {
    queryTypeList(treeSearchForm.getFieldsValue())
      .then((res) => {
        mapTree(res.data);
        setTreeData(res.data);
      })
      .catch((err) => {
        setTreeData([]);
        console.log('queryTypeList---err', err);
      });
  };
  // 统一接口 获取右侧表格数据
  const getTableData = () => {};

  // 编辑类别
  const detailSortInfo = () => {
    let query = {
      id: yTable.table.selectedNodes.id,
    };
    queryTypeDetails(query)
      .then((res) => {
        let value = {
          ...res.data,
          isAllowChild: Number(res.data?.isAllowChild),
          isCustom: Number(res.data?.isCustom),
          isOrgUse: Number(res.data?.isOrgUse),
          isSystem: Number(res.data?.isSystem),
          status: Number(res.data?.status),
        };
        setZdxxData(value);
        yTable.table.zdxxData = value;
        modalFormSort.setFieldsValue(value);
        console.log('zdxxData===', zdxxData);
      })
      .catch((err) => {
        console.log('getTreeDetail---err', err);
      });
  };

  // 删除类别
  const delSortInfo = () => {
    confirm({
      title: '删除字典类型',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      content: `您确定删除这个字典类型吗？`,
      centered: true,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        let query = {
          id: yTable.table.selectedNodes.id,
        };
        deleteType(query)
          .then((res) => {
            message.success(res?.message);
            yTable.table.selectedNodes = {};
            queryTypeListServices();
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

  // 打开弹窗
  const changeModal = (otype, changetype, data) => {
    modalForm.resetFields();
    setModalConfig({
      ...modalConfig,
      visible: changetype,
      title:
        otype === 'add'
          ? '新增字典明细'
          : otype === 'edit'
          ? '编辑字典明细'
          : otype === 'detail'
          ? '查看字典明细'
          : '字典明细',
      type: otype,
    });
    modalForm.setFieldsValue({
      typeId: yTable.table.selectedNodes?.id,
      // typeCode: yTable.table.selectedNodes?.code,
      typeName: yTable.table.selectedNodes?.name,
      parentId: yTable.table.dataRow?.dictId || 0,
      parentName: yTable.table.dataRow?.dictName,
    });
  };
  // 左侧弹窗设置修改
  const changeModalSort = (otype, changetype) => {
    modalFormSort.resetFields();
    setModalSortConfig({
      ...modalSortConfig,
      visible: changetype,
      title: otype === 'add' ? '新增字典类别' : otype === 'edit' ? '编辑字典类别' : '字典类别',
      type: otype,
    });
  };

  // 编辑方法
  const editInfo = (text, record) => {
    changeModal('edit', true);
  };

  // 保存分类数据
  const saveSortInfo = () => {
    console.log('.modalFormSort.getFieldsValue(): ', modalFormSort.getFieldsValue());

    if (modalSortConfig.type === 'add') {
    } else if (modalSortConfig.type === 'edit') {
    }
  };

  // 保存信息数据
  const saveInfoData = async () => {
    console.log('modalForm.getFieldsValue(): ', modalForm.getFieldsValue());
    if (modalConfig.type === 'add') {
    } else if (modalConfig.type === 'edit') {
    }
  };
  useEffect(() => {}, []);
  return (
    <div>
      <Row className="overflowXHidden margin0">
        <Col span={4} className={styles.treeBox}>
          <Form form={treeSearchForm} layout="vertical">
            <Form.Item label="" name="typeName" style={{ marginTop: '15px' }}>
              <Input onPressEnter={queryTypeListServices} />
            </Form.Item>
          </Form>
          <Divider style={{ margin: 0 }} />
          <DirectoryTree
            showIcon={false}
            treeData={treeData}
            defaultExpandAll
            className={styles.tree}
            onSelect={treeSelect}
          />
          <div className={styles.treebtn}>
            <Button
              type="primary"
              onClick={() => {
                changeModalSort('add', true);
              }}
            >
              新增
            </Button>
            <Button
              type="primary"
              onClick={() => {
                changeModalSort('edit', true);
              }}
            >
              编辑
            </Button>
            <Button onClick={() => delSortInfo()}>删除</Button>
          </div>
        </Col>
        <Col span={20}>
          <div className={styles.topForm}>
            <div className={styles.searchFormTips}>字典明细</div>
            <SearchForm searchForm={topRightForm} />
          </div>
          <div ref={tableRef} style={{ height: tableHeight }} className="yTableStyle">
            <YTable {...yTable} />
          </div>
        </Col>
      </Row>

      {/*新增字典类别*/}
      <Modal
        width={690}
        maskClosable={false}
        title={modalSortConfig.title}
        visible={modalSortConfig.visible}
        centered
        forceRender
        onOk={() => {
          modalFormSort.submit();
        }}
        onCancel={() => changeModalSort('', false)}
        okButtonProps={{ disabled: modalSortConfig.type === 'detail' }}
        cancelButtonProps={{ disabled: modalSortConfig.type === 'detail' }}
      >
        <Form form={modalFormSort} className={styles.modalform} onFinish={saveSortInfo}>
          <Row>
            {/*隐藏数据字段*/}
            <Form.Item name="id" hidden>
              <div />
            </Form.Item>

            {/* <Col span={12}>
              <Form.Item label="字典类型" name="categoryId">
                <Seltopt selectArr={zdlxSel} sWidth="100%" disabled />
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item
                label="类别编码"
                name="code"
                rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
              >
                <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="类别名称" name="name" rules={[{ required: true }]}>
                <Input
                  placeholder="请输入"
                  onBlur={(e) => {
                    modalFormSort.setFieldsValue({
                      pinyinCode: pinyin.getCamelChars(e.target.value),
                      wubiCode: makeWb(e.target.value),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="拼音码" name="pinyinCode">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="五笔码" name="wubiCode">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="排序号" name="sort">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="备注" name="remarks">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Row>
                {/* <Form.Item name="isSystem" valuePropName="checked">
                  <Checkbox>
                    <span className={styles.labeltext}>系统内置</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isAllowChild" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>支持多层</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isOrgUse" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>机构私有</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isCustom" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>允许机构增加</span>
                  </Checkbox>
                </Form.Item> */}
                <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>启用</span>
                  </Checkbox>
                </Form.Item>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/*新增字典明细*/}
      <Modal
        width={690}
        maskClosable={false}
        title={modalConfig.title}
        visible={modalConfig.visible}
        centered
        forceRender
        onOk={() => {
          modalForm.submit();
        }}
        onCancel={() => changeModal('', false)}
        okButtonProps={{ disabled: modalConfig.type === 'detail' }}
        cancelButtonProps={{ disabled: modalConfig.type === 'detail' }}
      >
        <Form form={modalForm} className={styles.modalform} onFinish={saveInfoData}>
          <Row>
            {/*隐藏数据字段*/}
            <Form.Item name="id" hidden>
              <div></div>
            </Form.Item>
            {/* <Form.Item name="orgId" hidden>
              <div></div>
            </Form.Item>
            <Form.Item name="typeId" hidden>
              <div></div>
            </Form.Item>
            <Form.Item name="parentId" hidden>
              <div></div>
            </Form.Item> */}

            {/* <Col span={12}>
              <Form.Item label="字典分类" name="typeName">
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={treeData}
                  treeDefaultExpandAll
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="上级节点" name="parentName">
                <Input disabled />
              </Form.Item>
            </Col> */}

            <Col span={12}>
              <Form.Item label="类别编码" name="dictCode" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="类别名称" name="dictCode" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="字典编码" name="dictCode" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="字典名称" name="dictName" rules={[{ required: true }]}>
                <Input
                  placeholder="请输入"
                  onBlur={(e) => {
                    modalForm.setFieldsValue({
                      pinyinCode: pinyin.getCamelChars(e.target.value),
                      wubiCode: makeWb(e.target.value),
                    });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="拼音码" name="pinyinCode">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="五笔码" name="wubiCode">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="排序号" name="sort">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="备注" name="remarks">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Row>
                {/* <Form.Item name="isOutpatient" valuePropName="checked">
                  <Checkbox>
                    <span className={styles.labeltext}>门诊使用</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isEmergency" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>急诊使用</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isHospitalized" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>住院使用</span>
                  </Checkbox>
                </Form.Item>
                <Form.Item name="isSystem" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>系统保留</span>
                  </Checkbox>
                </Form.Item> */}
                <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>启用</span>
                  </Checkbox>
                </Form.Item>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
