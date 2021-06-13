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
      title: '养老院',
      key: '1',
      type: 0,
      children: [
        {
          title: '1号楼',
          key: '11',
          type: 1,
          children: [
            {
              title: '1层',
              key: '111',
              type: 2,
              children: [
                {
                  title: '101室',
                  key: '1111',
                  type: 3,
                },
              ],
            },
          ],
        },
        {
          title: '2号楼',
          key: '12',
          type: 1,
          children: [
            {
              title: '1层',
              key: '121',
              type: 2,
              children: [
                {
                  title: '101室',
                  key: '1211',
                  type: 3,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  // 树形节点选中
  const treeSelect = async (selectedKeys, info) => {
    console.log('selectedKeys, info: ', selectedKeys, info);
    modalSortConfig.editType = info.node.type;
    setModalSortConfig({ ...modalSortConfig });
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
          title: '床位编号',
          dataIndex: 'bed_code',
          key: 'bed_code',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '床位名称',
          dataIndex: 'name',
          key: 'name',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '房间编号',
          dataIndex: 'room_code',
          key: 'room_code',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '楼层编号',
          dataIndex: 'floor_code',
          key: 'floor_code',
          ellipsis: true,
          width: 200,
        },
        {
          title: '楼宇编号',
          dataIndex: 'building_code',
          key: 'building_code',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '状态',
          dataIndex: 'is_del',
          key: 'is_del',
          width: 50,
          align: 'center',
          render: (text, record) => (record.is_del ? '启用' : '停用'),
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
  // modal配置项
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '床位信息',
    type: '',
    continue: false,
  });
  const [modalSortConfig, setModalSortConfig] = useState({
    visible: false,
    title: '楼宇楼层房间',
    type: '',
    editType: 4,
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
          ? '新增床位信息'
          : otype === 'edit'
          ? '编辑床位信息'
          : otype === 'detail'
          ? '查看床位信息'
          : '床位信息',
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
  const addOptions = ['楼宇', '楼层', '房间', ''];
  const editOptions = ['', '楼宇', '楼层', '房间'];
  // 左侧弹窗设置修改
  const changeModalSort = (otype, changetype) => {
    modalFormSort.resetFields();
    setModalSortConfig({
      ...modalSortConfig,
      visible: changetype,
      title:
        otype === 'add'
          ? `新增${addOptions[modalSortConfig.editType]}`
          : otype === 'edit'
          ? `编辑${editOptions[modalSortConfig.editType]}`
          : '',
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
      <Row className="flexNoWrap overflowXHidden margin0">
        <Col flex="0 0 280px" className={styles.treeBox}>
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
              disabled={modalSortConfig.editType === 3}
              type="primary"
              onClick={() => {
                changeModalSort('add', true);
              }}
            >
              新增{addOptions[modalSortConfig.editType]}
            </Button>
            <Button
              disabled={modalSortConfig.editType === 0}
              type="primary"
              onClick={() => {
                changeModalSort('edit', true);
              }}
            >
              编辑{editOptions[modalSortConfig.editType]}
            </Button>
            <Button onClick={() => delSortInfo()}>
              删除{editOptions[modalSortConfig.editType]}
            </Button>
          </div>
        </Col>
        <Col flex="1 1 auto">
          <div className={styles.topForm}>
            <div className={styles.searchFormTips}>床位信息</div>
            <SearchForm searchForm={topRightForm} />
          </div>
          <div ref={tableRef} style={{ height: tableHeight }} className="yTableStyle">
            <YTable {...yTable} />
          </div>
        </Col>
      </Row>

      {/*新增编辑*/}
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
        <Form
          form={modalFormSort}
          className={styles.modalform}
          onFinish={saveSortInfo}
          style={{ padding: '0 150px' }}
        >
          {/* 楼宇 */}
          {(modalSortConfig?.editType === 0 && modalSortConfig?.type === 'add') ||
          (modalSortConfig?.editType === 1 && modalSortConfig?.type === 'edit') ? (
            <Row>
              <Form.Item name="id" hidden></Form.Item>
              <Col span={24}>
                <Form.Item
                  label="楼宇编码"
                  name="building_code"
                  rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
                >
                  <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="楼宇名称" name="name" rules={[{ required: true }]}>
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
              <Col span={24}>
                <Row>
                  <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                    <Checkbox>
                      <span className={styles.labeltext}>启用？？？</span>
                    </Checkbox>
                  </Form.Item>
                </Row>
              </Col>
            </Row>
          ) : null}
          {/* 楼层 */}
          {(modalSortConfig?.editType === 1 && modalSortConfig?.type === 'add') ||
          (modalSortConfig?.editType === 2 && modalSortConfig?.type === 'edit') ? (
            <Row>
              <Form.Item name="id" hidden></Form.Item>
              <Col span={24}>
                <Form.Item
                  label="楼宇编码"
                  name="building_code"
                  rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
                >
                  <Input disabled placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="楼宇名称" name="name" rules={[{ required: true }]}>
                  <Input
                    disabled
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
              <Col span={24}>
                <Form.Item
                  label="楼层编码"
                  name="floor_code"
                  rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
                >
                  <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="楼层名称" name="name" rules={[{ required: true }]}>
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
              <Col span={24}>
                <Row>
                  <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                    <Checkbox>
                      <span className={styles.labeltext}>启用？？？</span>
                    </Checkbox>
                  </Form.Item>
                </Row>
              </Col>
            </Row>
          ) : null}
          {/* 房间 */}
          {(modalSortConfig?.editType === 2 && modalSortConfig?.type === 'add') ||
          (modalSortConfig?.editType === 3 && modalSortConfig?.type === 'edit') ? (
            <Row>
              <Form.Item name="id" hidden></Form.Item>
              <Col span={24}>
                <Form.Item
                  label="楼宇编码"
                  name="building_code"
                  rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
                >
                  <Input disabled placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="楼宇名称" name="name" rules={[{ required: true }]}>
                  <Input
                    disabled
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
              <Col span={24}>
                <Form.Item
                  label="楼层编码"
                  name="floor_code"
                  rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
                >
                  <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="楼层名称" name="name" rules={[{ required: true }]}>
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
              <Col span={24}>
                <Form.Item
                  label="房间编码"
                  name="room_code"
                  rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
                >
                  <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="房间名称" name="name" rules={[{ required: true }]}>
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
              <Col span={24}>
                <Row>
                  <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                    <Checkbox>
                      <span className={styles.labeltext}>启用？？？</span>
                    </Checkbox>
                  </Form.Item>
                </Row>
              </Col>
            </Row>
          ) : null}
        </Form>
      </Modal>

      {/*新增床位信息*/}
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
        <Form
          form={modalForm}
          className={styles.modalform}
          onFinish={saveInfoData}
          style={{ padding: '0 150px' }}
        >
          <Row>
            <Form.Item name="id" hidden></Form.Item>
            <Col span={24}>
              <Form.Item
                label="楼宇编码"
                name="building_code"
                rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
              >
                <Input disabled placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="楼宇名称" name="name" rules={[{ required: true }]}>
                <Input
                  disabled
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
            <Col span={24}>
              <Form.Item
                label="楼层编码"
                name="floor_code"
                rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
              >
                <Input disabled placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="楼层名称" name="name" rules={[{ required: true }]}>
                <Input
                  disabled
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
            <Col span={24}>
              <Form.Item
                label="房间编码"
                name="room_code"
                rules={modalSortConfig.type === 'edit' ? [] : [{ required: true }]}
              >
                <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="房间名称" name="name" rules={[{ required: true }]}>
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
            <Col span={24}>
              <Form.Item label="床位编号" name="bed_code" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="床位名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入" disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Row>
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
