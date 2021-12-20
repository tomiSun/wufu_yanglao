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
import {
  dictTypeAdd,
  dictTypeDel,
  dictTypeSelect,
  dictTypeUpdate,
  dictDateAdd,
  dictDateDel,
  dictDateSelect,
  dictDateUpdate,
} from '@/services/basicSetting/dictionary';

const { confirm } = Modal;
const { TextArea } = Input;
const { DirectoryTree } = Tree;
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  // modalForm
  const [treeSearchForm] = Form.useForm();
  // 树数据
  const [treeData, setTreeData] = useState([]);
  // 树形节点选中
  const treeSelect = async (selectedKeys, info) => {
    console.log(info);
    yTable.table.selectedNode = info.node.allParams;
    getTableData();
    setYTable({ ...yTable });
  };
  // modal配置项
  const [modalFormSort] = Form.useForm();
  const [modalSortConfig, setModalSortConfig] = useState({
    visible: false,
    title: '字典类别',
    type: '',
    continue: false,
    loading: false,
  });
  // 左侧弹窗设置修改
  const changeModalSort = (type, visible) => {
    modalFormSort.resetFields();
    setModalSortConfig({
      ...modalSortConfig,
      visible,
      title: type === 'add' ? '新增字典类别' : type === 'edit' ? '编辑字典类别' : '字典类别',
      type,
    });
    if (type === 'edit' && visible) {
      modalFormSort.setFieldsValue({ ...yTable.table.selectedNode });
    }
  };
  // 保存分类数据
  const saveSortInfo = async () => {
    const formData = await modalFormSort.validateFields();
    const params = { ...formData, useFlag: ~~formData?.useFlag };
    modalSortConfig.loading = true;
    setModalSortConfig({ ...modalSortConfig });
    if (modalSortConfig.type === 'add') {
      dictTypeAdd(params)
        .then((res) => {
          message.success(res?.msg);
          // 刷新字典类别数据
          getTreeData();
          modalSortConfig.visible = false;
          modalSortConfig.loading = false;
          setModalSortConfig({ ...modalSortConfig });
        })
        .catch((err) => {
          console.log('err-logining: ', err);
          modalSortConfig.loading = false;
          setModalSortConfig({ ...modalSortConfig });
        });
    } else if (modalSortConfig.type === 'edit') {
      dictTypeUpdate(params)
        .then((res) => {
          message.success(res?.msg);
          // 刷新字典类别数据
          getTreeData();
          modalSortConfig.visible = false;
          modalSortConfig.loading = false;
          setModalSortConfig({ ...modalSortConfig });
        })
        .catch((err) => {
          console.log('err-logining: ', err);
          modalSortConfig.loading = false;
          setModalSortConfig({ ...modalSortConfig });
        });
    }
  };
  // 获取字典类别
  const getTreeData = () => {
    setTreeData([]);
    const { keyWord } = treeSearchForm.getFieldsValue();
    dictTypeSelect({ keyWord: keyWord || '' })
      .then((res) => {
        const tree =
          res?.data?.map((it) => {
            return {
              title: it.dictTypeName,
              key: it.dictTypeCode,
              allParams: it,
            };
          }) || [];
        setTreeData(tree);
      })
      .catch((err) => {
        setTreeData([]);
        console.log('dictTypeSelect---err', err);
      });
  };
  // 删除类别
  const delSortInfo = () => {
    if (!yTable.table.selectedNode?.dictTypeCode) {
      message.error('请选择要删除的字典类别');
      return;
    }
    confirm({
      title: '删除',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      content: `您确定删除吗？`,
      centered: true,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        dictTypeDel({ typeCodes: yTable.table.selectedNode?.dictTypeCode || '' })
          .then((res) => {
            message.success(res?.msg);
            yTable.table.selectedNode = {};
            getTreeData();
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
  // --------------------------------------------------------------------------
  // yTable
  const [yTable, setYTable] = useState({
    table: {
      bordered: true,
      loading: false,
      scroll: { y: '100%' },
      pagination: {
        current: 1,
        pageSize: 20,
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
      dataSource: [],
      dataRow: {},
      selectedNode: {},
      zdxxData: {},
      columns: [
        {
          title: '排序号',
          dataIndex: 'sortNo',
          key: 'sortNo',
          align: 'center',
          width: 60,
          render: (text, record, index) => index + 1,
        },
        {
          title: '类别编码',
          dataIndex: 'dictTypeCode',
          key: 'dictTypeCode',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '字典编码',
          dataIndex: 'dictCode',
          key: 'dictCode',
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
          title: '五笔码',
          dataIndex: 'wubiCode',
          key: 'wubiCode',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '拼音码',
          dataIndex: 'pinyinCode',
          key: 'pinyinCode',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '状态',
          dataIndex: 'useFlag',
          key: 'useFlag',
          width: 50,
          align: 'center',
          render: (text, record, info) => (text === 1 ? '启用' : '停用'),
        },
        {
          title: '操作',
          key: 'opera',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <div className={styles.opera}>
              {yTable.table.selectedNode.status === '1' ? (
                <span style={{ color: '#d9d9d9' }}>编辑</span>
              ) : (
                <a
                  onClick={() => {
                    changeModal('edit', true, record);
                  }}
                >
                  编辑
                </a>
              )}

              <Divider type="vertical" />
              <a onClick={() => delInfo(record)}>删除</a>
            </div>
          ),
        },
      ],
    },
  });
  // 右侧searchForm
  const [formTopRight] = Form.useForm();
  const topRightForm = {
    inputArr: [
      {
        label: '',
        name: 'keyWord',
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
        bconfig: {
          disabled: !yTable?.table?.selectedNode?.id,
        },
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
      yTable.table.selectedNode?.id && ((yTable.table.pagination.current = 1), getTableData());
    },
  };

  // modal配置项
  const [modalForm] = Form.useForm();
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '字典明细',
    type: '',
    continue: false,
    loading: false,
  });
  // 打开弹窗
  const changeModal = (type, visible, record) => {
    modalForm.resetFields();
    setModalConfig({
      ...modalConfig,
      visible,
      title:
        type === 'add'
          ? '新增字典明细'
          : type === 'edit'
          ? '编辑字典明细'
          : type === 'detail'
          ? '查看字典明细'
          : '字典明细',
      type,
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
      });
    }
  };
  // 保存信息数据
  const saveInfoData = async () => {
    const formData = await modalForm.validateFields();
    const params = { ...formData, useFlag: ~~formData?.useFlag };
    modalConfig.loading = true;
    setModalConfig({ ...modalConfig });
    if (modalConfig.type === 'add') {
      dictDateAdd(params)
        .then((res) => {
          message.success(res?.msg);
          // 刷新字典类别数据
          getTableData();
          modalConfig.loading = false;
          modalConfig.visible = false;
          setModalConfig({ ...modalConfig });
        })
        .catch((err) => {
          console.log('err-logining: ', err);
          modalConfig.loading = false;
          setModalConfig({ ...modalConfig });
        });
    } else if (modalConfig.type === 'edit') {
      dictDateUpdate(params)
        .then((res) => {
          message.success(res?.msg);
          // 刷新字典类别数据
          getTableData();
          modalConfig.loading = false;
          modalConfig.visible = false;
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
    if (!yTable.table.selectedNode?.dictTypeCode) {
      return;
    }
    const { keyWord } = formTopRight.getFieldsValue();
    const params = {
      search: keyWord,
      typeCode: yTable.table.selectedNode?.dictTypeCode,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    dictDateSelect(params)
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
        dictDateDel({ dictCodes: record?.dictCode || '', typeCode: record?.dictTypeCode || '' })
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
  useEffect(() => {
    // 获取字典类别列表
    getTreeData();
  }, []);
  return (
    <div>
      <Row className="overflowXHidden margin0">
        <Col span={4} className={styles.treeBox}>
          <Form form={treeSearchForm} layout="vertical">
            <Form.Item label="" name="keyWord" style={{ marginTop: '15px' }}>
              <Input onPressEnter={getTreeData} />
            </Form.Item>
          </Form>
          <Divider style={{ margin: 0 }} />
          <DirectoryTree
            showIcon={false}
            treeData={treeData}
            selectedKeys={
              yTable.table.selectedNode?.dictTypeCode
                ? [yTable.table.selectedNode?.dictTypeCode]
                : []
            }
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

      {/* 新增字典类别 */}
      <Modal
        width={720}
        maskClosable={false}
        title={modalSortConfig.title}
        visible={modalSortConfig.visible}
        centered
        forceRender
        onOk={() => {
          modalFormSort.submit();
        }}
        confirmLoading={modalSortConfig.loading}
        onCancel={() => changeModalSort('', false)}
        okButtonProps={{ disabled: modalSortConfig.type === 'detail' }}
        cancelButtonProps={{ disabled: modalSortConfig.type === 'detail' }}
      >
        <Form
          form={modalFormSort}
          className={styles.modalform}
          onFinish={saveSortInfo}
          initialValues={{ useFlag: 1 }}
        >
          <Row>
            {/* 隐藏数据字段 */}
            <Form.Item name="id" hidden></Form.Item>
            <Col span={12}>
              <Form.Item label="类别编码" name="dictTypeCode" rules={[{ required: true }]}>
                <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="类别名称" name="dictTypeName" rules={[{ required: true }]}>
                <Input
                  placeholder="请输入"
                  onChange={(e) => {
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
              <Form.Item label="排序号" name="sortNo">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <TextArea placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Row>
                <Form.Item name="useFlag" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>启用</span>
                  </Checkbox>
                </Form.Item>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 新增字典明细 */}
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
          initialValues={{ useFlag: 1 }}
        >
          <Row>
            {/* 隐藏数据字段 */}
            <Form.Item name="id" hidden></Form.Item>

            <Col span={12}>
              <Form.Item label="类别编码" name="dictTypeCode" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item label="类别名称" name="dictTypeName" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label="字典编码" name="dictCode" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="字典名称" name="dictName" rules={[{ required: true }]}>
                <Input
                  placeholder="请输入"
                  onChange={(e) => {
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
              <Form.Item label="排序号" name="sortNo">
                <InputNumber min={0} precision={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Row>
                <Form.Item name="useFlag" valuePropName="checked" style={{ marginLeft: 8 }}>
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
