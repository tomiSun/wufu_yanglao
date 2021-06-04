import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Table,
  Tooltip,
  Tree,
  TreeSelect,
  Spin,
  Descriptions,
  message,
  InputNumber,
} from 'antd';
import { makeWb, pinyin } from 'yunyi-convert';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  queryCateList,
  healthCareCategory,
  queryTypeList,
  queryTypeDetails,
  updateType,
  insertType,
  deleteType,
  queryTypeDetailsList,
  querySingleDictDetails,
  updateTypeDetail,
  insertTypeDetail,
} from '@/services/deployment/dictionary';
import { SearchForm, YTable, Seltopt } from 'yunyi-component';
import styles from './index.less';

const { confirm } = Modal;
const { TextArea } = Input;
const { DirectoryTree } = Tree;

const Dictionary = (props) => {
  const [zdlxSel, setZdlxSel] = useState([]); // 下拉列表-字典类型
  const [treeData, setTreeData] = useState([]); // 树数据
  const [treeSel, setTreeSel] = useState({}); // 树选择的内容
  const [zdxxData, setZdxxData] = useState({}); // 字典信息
  const zdxxColumn = [
    {
      title: '分类名称',
      content: zdxxData?.name || '--',
    },
    {
      title: '类别编码',
      content: zdxxData?.code || '--',
    },
    {
      title: '系统内置',
      content: zdxxData?.isSystem === undefined ? '--' : zdxxData.isSystem === 0 ? '否' : '是',
    },
    {
      title: '支持多层',
      content:
        zdxxData?.isAllowChild === undefined ? '--' : zdxxData.isAllowChild === 0 ? '否' : '是',
    },
    {
      title: '机构私有',
      content: zdxxData?.isOrgUse === undefined ? '--' : zdxxData.isOrgUse === 0 ? '否' : '是',
    },
    {
      title: '允许机构增加',
      content: zdxxData?.isCustom === undefined ? '--' : zdxxData.isCustom === 0 ? '否' : '是',
    },
    {
      title: '停用',
      content: zdxxData?.status === undefined ? '--' : zdxxData.status === 0 ? '否' : '是',
    },
    {
      span: 20,
      title: '备注',
      content: zdxxData?.remarks || '--',
    },
  ]; // 字典信息
  // form - 字典
  // yTable - 字典
  const [yTable, setYTable] = useState({
    table: {
      className: styles.yTable,
      bordered: true,
      loading: false,
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
          queryTypeDetailsListServices();
        },
      },
      dataSource: [],
      dataRow: {},
      selectedNodes: {},
      zdxxData: {},
      columns: [
        // {
        //   title: '序号',
        //   dataIndex: 'sort',
        //   key: 'sort',
        //   align: 'center',
        //   width: 45,
        //   render: (text, record, index) => index + 1,
        // },
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
          title: '自定义码',
          dataIndex: 'customCode',
          key: 'customCode',
          ellipsis: true,
          // width: 100,
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
          title: '上级节点',
          dataIndex: 'parentName',
          key: 'parentName',
          ellipsis: true,
          // width: 100,
        },
        {
          title: '门诊使用',
          dataIndex: 'isOutpatient',
          key: 'isOutpatient',
          align: 'center',
          width: 70,
          // render: (text, record) => <Checkbox defaultChecked={record.isOutpatient} disabled/>,
          render: (text, record) => (record.isOutpatient ? '是' : '否'),
        },
        {
          title: '急诊使用',
          dataIndex: 'isEmergency',
          key: 'isEmergency',
          align: 'center',
          width: 70,
          // render: (text, record) => <Checkbox defaultChecked={record.isEmergency} disabled/>,
          render: (text, record) => (record.isEmergency ? '是' : '否'),
        },
        {
          title: '住院使用',
          dataIndex: 'isHospitalized',
          key: 'isHospitalized',
          align: 'center',
          width: 70,
          // render: (text, record) => <Checkbox defaultChecked={record.isHospitalized} disabled/>,
          render: (text, record) => (record.isHospitalized ? '是' : '否'),
        },
        {
          title: '显示序号',
          dataIndex: 'sort',
          key: 'sort',
          align: 'center',
          width: 70,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 50,
          align: 'center',
          // render: (text, record) => <Switch checked={record.status} size="small" disabled/>,
          render: (text, record) => (record.status ? '停用' : '有效'),
        },
        {
          title: '操作',
          key: 'opera',
          align: 'center',
          width: 100,
          render: (text, record) => (
            <div className={styles.opera}>
              {record.status === 1 ||
              yTable.table.selectedNodes.status === '1' ||
              yTable.table.zdxxData?.isAllowChild === 0 ? (
                <span style={{ color: '#d9d9d9' }}>新增</span>
              ) : (
                <a
                  onClick={() => {
                    yTable.table.dataRow = record;
                    changeModal('add', true);
                  }}
                >
                  新增
                </a>
              )}
              <Divider type="vertical" />
              {/*<a onClick={() => editInfo(text, record)}>编辑</a>*/}
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

              {/*<Divider type="vertical"/>*/}
              {/*<a onClick={() => delInfo(text, record)}>删除</a>*/}
            </div>
          ),
        },
      ],
    },
  });
  const [zdUseForm] = Form.useForm();
  const zdForm = {
    // inputArr: [
    //   {
    //     label: '字典名称',
    //     name: 'name',
    //     placeholder: '请输入',
    //     sort: 1,
    //     style: {
    //       width: 200,
    //     },
    //   },
    // ],
    btnArr: [
      {
        name: '刷新',
        type: 'primary',
        htmlType: 'submit',
        bconfig: {
          disabled: !treeSel.id,
        },
      },
      {
        name: '新增',
        type: 'primary',
        bconfig: {
          disabled: treeSel.id && yTable.table.selectedNodes.status === '0' ? false : true,
        },
        style: {
          marginLeft: 8,
        },
        callback: () => {
          yTable.table.selectedNodes?.id && ((yTable.table.dataRow = {}), changeModal('add', true));
        },
      },
    ],
    layout: 'inline',
    form: zdUseForm,
    cls: styles.zdForm,
    getInfoData: (value) => {
      yTable.table.selectedNodes?.id &&
        ((yTable.table.pagination.current = 1), queryTypeDetailsListServices());
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

  // 递归树数据-待优化
  const mapTree = (data) => {
    let treeArr = Object.assign([], data);
    const getChildren = (resultarr) => {
      resultarr.forEach((elemt) => {
        elemt.title = elemt.name;
        elemt.value = elemt.id;
        elemt.key = elemt.id;
        // delete elemt.code;
        // delete elemt.id;
        // delete elemt.name;
        // if (elemt.setIncomeTypeDtoList && elemt.setIncomeTypeDtoList.length > 0) {
        //   elemt.children = elemt.setIncomeTypeDtoList;
        //   delete elemt.setIncomeTypeDtoList;
        //   getChildren(elemt.children);
        // }
      });
    };
    getChildren(treeArr);
  };

  // 递归表格树数据-待优化
  const mapTableTree = (data) => {
    let treeArr = Object.assign([], data);
    const getChildren = (resultarr) => {
      resultarr.forEach((elemt) => {
        elemt.key = elemt.dictId;
        elemt.id = elemt.dictId;
        elemt.isOutpatient = Number(elemt?.businessPermit?.isOutpatient);
        elemt.isHospitalized = Number(elemt?.businessPermit?.isHospitalized);
        elemt.isEmergency = Number(elemt?.businessPermit?.isEmergency);
        elemt.isSystem = Number(elemt?.isSystem);
        elemt.status = Number(elemt?.status);
        // delete elemt.code;
        // delete elemt.id;
        // delete elemt.name;
        if (elemt.children && elemt.children.length > 0) {
          getChildren(elemt.children);
        }
      });
    };
    getChildren(treeArr);
  };

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
  const queryTypeDetailsListServices = (type) => {
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    let query = {
      orgId: 0,
      typeId: yTable.table.selectedNodes.id,
      isOrgUse: yTable.table.selectedNodes.isOrgUse,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    console.log('获取右侧表格数据', query);
    queryTypeDetailsList(query)
      .then((res) => {
        mapTableTree(res.data.list);
        // res.data.list.map((item) => {
        //   item.key = Math.random();
        //   item.id = item?.dictId;
        // });
        console.log('res.data.list===', res.data.list);
        yTable.table.loading = false;
        yTable.table.pagination.total = res.data.total;
        yTable.table.dataSource = res.data.list;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        yTable.table.dataSource = [];
        setYTable({ ...yTable });
        console.log('queryTypeDetailsList---err', err);
      });
  };

  const init = async () => {
    // console.log('sessionStorage.getItem(\'crumbsList\')===',JSON.parse(sessionStorage.getItem('crumbsList').split(",")).length)
    // 查询该路由的自定义参数
    let hash1 = window.location.hash.replace('#', '');
    let hashArr = window.location.hash.split('/');
    // let hash = window.location.hash.split('/').slice(-2).join('/');
    let hash = `/${hashArr[hashArr.length - 2]}/${hashArr[hashArr.length - 1]}`;
    console.log('hash===', hash1, hash);
    let crumbsList = JSON.parse(sessionStorage.getItem('crumbsList')?.split(',')) || [];
    let isMedicare = crumbsList?.filter((item) => item.path === hash)[0]?.customParameterObject
      ?.isMedicare;
    console.log('isMedicare===', crumbsList, isMedicare);
    if (isMedicare) {
      // 接口请求-查询字典类型列表
      let sel = [];
      isMedicare === '0' &&
        (await queryCateList()
          .then((res) => {
            sel = res.data;
          })
          .catch((err) => {
            console.log('queryCateList---err' + err);
          }));
      await healthCareCategory()
        .then((res) => {
          sel.push(res.data);
        })
        .catch((err) => {
          console.log('queryCateList---err' + err);
        });
      sel = await JSON.parse(JSON.stringify(sel).replace(/id/g, 'key'));
      await setZdlxSel(sel);
      await treeSearchForm.setFieldsValue({
        categoryId: sel[0]?.key,
      });

      // console.log('sel.length长度===',sel.length)
      sel.length && (await queryTypeListServices());
    }
  };
  useEffect(() => {
    setTimeout(() => {
      init();
    }, 0);
    // console.log('init----props',props.route)
  }, []);

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
    let query = {
      dictId: record.dictId,
    };
    querySingleDictDetails(query)
      .then((res) => {
        setDetails({ ...res.data });
        modalForm.setFieldsValue({
          ...res.data,
          isOutpatient: Number(res.data?.businessPermit?.isOutpatient),
          isHospitalized: Number(res.data?.businessPermit?.isHospitalized),
          isEmergency: Number(res.data?.businessPermit?.isEmergency),
          isSystem: Number(res.data?.isSystem),
          status: Number(res.data?.status),
        });
      })
      .catch((err) => {
        console.log('querySingleDictDetails---err', err);
      });
  };

  // 树形节点选中
  const treeSelect = async (selectedKeys, info) => {
    if (selectedKeys.length) {
      yTable.table.selectedNodes = info.selectedNodes[0];
      setTreeSel(info.selectedNodes[0]);
      await detailSortInfo();
      yTable.table.pagination.current = 1;
      await queryTypeDetailsListServices({ typeId: selectedKeys[0] }, 'first');
    }
    // else {
    //   setTreeSel([]);
    //   yTable.table.selectedNodes = {};
    // }
  };

  // 保存分类数据
  const saveSortInfo = () => {
    let query = {
      ...modalFormSort.getFieldsValue(),
      isSystem: ~~modalFormSort.getFieldValue('isSystem'),
      isAllowChild: ~~modalFormSort.getFieldValue('isAllowChild'),
      isOrgUse: ~~modalFormSort.getFieldValue('isOrgUse'),
      isCustom: ~~modalFormSort.getFieldValue('isCustom'),
      status: ~~modalFormSort.getFieldValue('status'),
    };
    if (modalSortConfig.type === 'add') {
      insertType(query).then((res) => {
        message.success(res?.message);
        changeModalSort('', false);
        queryTypeListServices();
      });
    } else if (modalSortConfig.type === 'edit') {
      query = {
        ...zdxxData,
        ...query,
      };
      updateType(query).then((res) => {
        message.success(res?.message);
        changeModalSort('', false);
        yTable.table.selectedNodes.name = query.name;
        detailSortInfo();
        queryTypeListServices();
      });
    }
  };

  // 保存信息数据
  const saveInfoData = async (values) => {
    let query = {
      ...modalForm.getFieldsValue(),
      orgId: 0,
      isOrgOperation: 0, // 平台专用固定传参
      businessPermit: {
        isOutpatient: ~~modalForm.getFieldValue('isOutpatient'),
        isHospitalized: ~~modalForm.getFieldValue('isHospitalized'),
        isEmergency: ~~modalForm.getFieldValue('isEmergency'),
      },
      isSystem: ~~modalForm.getFieldValue('isSystem'),
      status: ~~modalForm.getFieldValue('status'),
    };
    if (modalConfig.type === 'add') {
      insertTypeDetail(query)
        .then((res) => {
          message.success(res?.message);
          changeModal('', false);
          queryTypeDetailsListServices();
        })
        .catch((err) => {
          console.log('insertTypeDetail---err', err);
        });
    } else if (modalConfig.type === 'edit') {
      query = {
        ...details,
        ...query,
      };
      updateTypeDetail(query)
        .then((res) => {
          message.success(res?.message);
          changeModal('', false);
          queryTypeDetailsListServices();
        })
        .catch((err) => {
          console.log('updateTypeDetail---err', err);
        });
    }
  };

  return (
    <div>
      <Row gutter="24" className="overflowXHidden margin0">
        <Col span={4} className={styles.treeBox}>
          <Form form={treeSearchForm} layout="vertical">
            <Form.Item label="字典类型" name="categoryId">
              <Seltopt
                selectArr={zdlxSel}
                sWidth="100%"
                callback={(cb) => {
                  treeSearchForm.setFieldsValue({
                    categoryId: cb,
                  });
                  queryTypeListServices();
                }}
              />
            </Form.Item>
            <Form.Item label="查询" name="typeName">
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
                modalFormSort.setFieldsValue({
                  categoryId: treeSearchForm.getFieldValue('categoryId'),
                });
              }}
            >
              新增
            </Button>
            <Button
              type="primary"
              disabled={!treeSel.id}
              onClick={() => {
                changeModalSort('edit', true);
                detailSortInfo();
              }}
            >
              编辑
            </Button>
            <Button disabled={!treeSel.id} onClick={() => delSortInfo()}>
              删除
            </Button>
          </div>
        </Col>
        <Col span={20} style={{ paddingRight: 16 }}>
          <Descriptions className={styles.dicMessage} title="字典信息" column={7}>
            {zdxxColumn.map((item, index) => {
              return (
                <Descriptions.Item key={index} label={item.title}>
                  <Tooltip title={item.content}>{item.content}</Tooltip>
                </Descriptions.Item>
              );
            })}
          </Descriptions>
          <Divider style={{ margin: '0 0 16px 0' }} />

          <div>
            <div className={styles.searchFormTips}>字典明细</div>
            <SearchForm searchForm={zdForm} />
          </div>
          <YTable {...yTable} />
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

            <Col span={12}>
              <Form.Item label="字典类型" name="categoryId">
                <Seltopt selectArr={zdlxSel} sWidth="100%" disabled />
              </Form.Item>
            </Col>
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
                <Form.Item name="isSystem" valuePropName="checked">
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
                </Form.Item>
                <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>停用</span>
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
            <Form.Item name="orgId" hidden>
              <div></div>
            </Form.Item>
            <Form.Item name="typeId" hidden>
              <div></div>
            </Form.Item>
            <Form.Item name="parentId" hidden>
              <div></div>
            </Form.Item>

            <Col span={12}>
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
              <Form.Item label="自定义码" name="customCode">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="显示序号" name="sort">
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
                <Form.Item name="isOutpatient" valuePropName="checked">
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
                </Form.Item>
                <Form.Item name="status" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>停用</span>
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
export default Dictionary;
