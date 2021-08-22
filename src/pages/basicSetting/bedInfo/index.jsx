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
  Select,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchForm, YTable } from 'yunyi-component';
import styles from './index.less';
import { useTableHeight } from '@/utils/tableHeight';
const { confirm } = Modal;
const { TextArea } = Input;
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import {
  bedAdd,
  bedInfoDel,
  bedQuery,
  bedUpdate,
  bedBuildDelete,
  bedBuildList,
  bedBuildAdd,
  bedBuildQuery,
  bedBuildUpdate,
  bedFloorDelete,
  bedFloorList,
  bedFloorAdd,
  bedFloorQuery,
  bedFloorUpdate,
  bedRoomDelete,
  bedRoomList,
  bedRoomAdd,
  bedRoomQuery,
  bedRoomUpdate,
  bedTree,
} from '@/services/basicSetting/bedInfo';
import { findValByKey, getDefaultOption } from '@/utils/common';
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  // 基础字典数据
  const [basic, setBasic] = useState({});
  const [buildingOpt, setBuildingOpt] = useState([]);
  const [floorOpt, setFloorOpt] = useState([]);
  const [roomOpt, setRoomOpt] = useState([]);
  // 树数据
  const [treeData, setTreeData] = useState([
    {
      title: '养老院',
      key: '1',
      children: [
        {
          title: '1号楼',
          key: '462206690549436416',
          id: '462206690549436416',
          code: '0001',
          children: [
            {
              title: '1层',
              key: '462216765221507072',
              id: '462216765221507072',
              code: '0001',
              buildingCode: '0001',
              children: [
                {
                  title: '101室',
                  key: '462217481315028992',
                  id: '462217481315028992',
                  code: '0001',
                  floorCode: '0001',
                  buildingCode: '0001',
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
    formTopRight.resetFields();
    let pos = info.node.pos.split('-');
    // 0 养老院 1 楼宇 2 楼层 3 房间
    let editType = pos.length - 2;
    modalSortConfig.editType = editType;
    setModalSortConfig({ ...modalSortConfig });
    yTable.table.selectedNode = info.node;
    getTableData(editType);
  };
  const [modalSortConfig, setModalSortConfig] = useState({
    visible: false,
    title: '楼宇楼层房间',
    type: '',
    editType: 0,
    continue: false,
  });
  // yTable
  const columns = (modalSortConfig) => {
    const { editType } = modalSortConfig;
    let mergeArr = [];
    let baseBefore = [
      // {
      //   title: '排序号',
      //   dataIndex: 'sort',
      //   key: 'sort',
      //   align: 'center',
      //   width: 60,
      //   render: (text, record, index) => index + 1,
      // },
    ];
    let baseAfter = [
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
                  // editInfo(text, record);
                  changeModalSort('edit', true, record);
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
    ];
    switch (editType) {
      case 0:
        mergeArr = [
          {
            title: '楼宇编号',
            dataIndex: 'buildingCode',
            key: 'buildingCode',
            ellipsis: true,
            width: 100,
          },
          {
            title: '楼宇名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 100,
          },
          ...baseAfter,
        ];
        break;
      case 1:
        mergeArr = [
          {
            title: '楼层编号',
            dataIndex: 'floorCode',
            key: 'floorCode',
            ellipsis: true,
            width: 100,
          },
          {
            title: '楼层名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 100,
          },
          {
            title: '所属楼宇',
            dataIndex: 'buildingCode',
            key: 'buildingCode',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(buildingOpt, 'value', text, 'label'),
          },
          ...baseAfter,
        ];
        break;
      case 2:
        mergeArr = [
          {
            title: '房间编号',
            dataIndex: 'roomCode',
            key: 'roomCode',
            ellipsis: true,
            width: 100,
          },
          {
            title: '房间名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 100,
          },
          {
            title: '房间朝向',
            dataIndex: 'roomToward',
            key: 'roomToward',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(basic['0002'], 'value', text, 'label'),
          },
          {
            title: '房间类型',
            dataIndex: 'roomType',
            key: 'roomType',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(basic['0003'], 'value', text, 'label'),
          },
          {
            title: '所属楼层',
            dataIndex: 'floorCode',
            key: 'floorCode',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(floorOpt, 'value', text, 'label'),
          },
          {
            title: '所属楼宇',
            dataIndex: 'buildingCode',
            key: 'buildingCode',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(buildingOpt, 'value', text, 'label'),
          },
          ...baseAfter,
        ];
        break;
      case 3:
        mergeArr = [
          {
            title: '床位编号',
            dataIndex: 'bedCode',
            key: 'bedCode',
            ellipsis: true,
            width: 100,
          },
          {
            title: '床位名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 100,
          },
          // {
          //   title: '入住状态',
          //   dataIndex: 'status',
          //   align: 'left',
          //   ellipsis: true,
          //   width: 100,
          //   render: (text) => findValByKey(basic['0004'], 'value', text, 'label'),
          // },
          {
            title: '状态',
            dataIndex: 'useFlag',
            align: 'left',
            ellipsis: true,
            width: 50,
            render: (text, record, info) => (text === 1 ? '启用' : '停用'),
          },
          {
            title: '所属房间',
            dataIndex: 'roomCode',
            key: 'roomCode',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(roomOpt, 'value', text, 'label'),
          },
          {
            title: '所属楼层',
            dataIndex: 'floorCode',
            key: 'floorCode',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(floorOpt, 'value', text, 'label'),
          },
          {
            title: '所属楼宇',
            dataIndex: 'buildingCode',
            key: 'buildingCode',
            ellipsis: true,
            width: 100,
            render: (text) => findValByKey(buildingOpt, 'value', text, 'label'),
          },
          ...baseAfter,
        ];
        break;

      default:
        break;
    }
    return mergeArr;
  };
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
      dataSource: [],

      dataRow: {},
      selectedNode: {},
      zdxxData: {},
    },
  });
  const [formTopRight] = Form.useForm();
  const topRightForm = {
    inputArr: [
      {
        label: '',
        name: 'keyWords',
        placeholder: '请输入',
        sort: 1,
        style: {
          width: 200,
        },
        pressEnter: (enter) => {
          getTableData(modalSortConfig.editType);
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
          // changeModal('add', true);
          changeModalSort('add', true);
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

  // 统一接口 获取类型下的分类列表
  const getTreeData = () => {
    setTreeData([]);
    bedTree(treeSearchForm.getFieldsValue())
      .then((res) => {
        // mapTree(res.data);
        setTreeData(res.data);
      })
      .catch((err) => {
        setTreeData([]);
        console.log('queryTypeList---err', err);
      });
    // 下拉框
    getOpt();
  };
  // 统一接口 获取右侧表格数据
  const getTableData = (key) => {
    getTreeData();
    const editType = key || modalSortConfig.editType;
    const { keyWords } = formTopRight.getFieldsValue();
    let params = {
      keyWords,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    switch (editType) {
      case 0:
        bedBuildQuery(params)
          .then((res) => {
            yTable.table.dataSource = res?.data?.list || [];
            yTable.table.loading = false;
            // yTable.table.pagination.current = res?.data?.pageNum;
            setYTable({ ...yTable });
          })
          .catch((err) => {
            yTable.table.loading = false;
            setYTable({ ...yTable });
            console.log('bedBuildQuery---err', err);
          });
        break;
      case 1:
        bedFloorQuery({ ...params, id: yTable.table.selectedNode?.id })
          .then((res) => {
            yTable.table.dataSource = res?.data?.list || [];
            yTable.table.loading = false;
            // yTable.table.pagination.current = res?.data?.pageNum;
            setYTable({ ...yTable });
          })
          .catch((err) => {
            yTable.table.loading = false;
            setYTable({ ...yTable });
            console.log('bedFloorQuery---err', err);
          });
        break;
      case 2:
        bedRoomQuery({ ...params, id: yTable.table.selectedNode?.id })
          .then((res) => {
            yTable.table.dataSource = res?.data?.list || [];
            yTable.table.loading = false;
            // yTable.table.pagination.current = res?.data?.pageNum;
            setYTable({ ...yTable });
          })
          .catch((err) => {
            yTable.table.loading = false;
            setYTable({ ...yTable });
            console.log('bedRoomQuery---err', err);
          });
        break;
      case 3:
        bedQuery({ ...params, id: yTable.table.selectedNode?.id })
          .then((res) => {
            yTable.table.dataSource = res?.data?.list || [];
            yTable.table.loading = false;
            // yTable.table.pagination.current = res?.data?.pageNum;
            setYTable({ ...yTable });
          })
          .catch((err) => {
            yTable.table.loading = false;
            setYTable({ ...yTable });
            console.log('bedQuery---err', err);
          });
        break;

      default:
        break;
    }
  };

  // 编辑类别
  const detailSortInfo = () => {
    let query = {
      id: yTable.table.selectedNode.id,
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
  const delInfo = (record) => {
    const { editType } = modalSortConfig;
    confirm({
      title: '删除',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      content: `您确定删除吗？`,
      centered: true,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        let query = {
          id: record.id,
        };
        switch (editType) {
          case 0:
            bedBuildDelete(query)
              .then((res) => {
                message.success(res?.msg);
                yTable.table.dataRow = {};
                getTableData();
              })
              .catch((err) => {
                console.log('deleteType---err', err);
              });
            break;
          case 1:
            bedFloorDelete(query)
              .then((res) => {
                message.success(res?.msg);
                yTable.table.dataRow = {};
                getTableData();
              })
              .catch((err) => {
                console.log('deleteType---err', err);
              });
            break;
          case 2:
            bedRoomDelete(query)
              .then((res) => {
                message.success(res?.msg);
                yTable.table.dataRow = {};
                getTableData();
              })
              .catch((err) => {
                console.log('deleteType---err', err);
              });
            break;
          case 3:
            bedInfoDel(query)
              .then((res) => {
                message.success(res?.msg);
                yTable.table.dataRow = {};
                getTableData();
              })
              .catch((err) => {
                console.log('deleteType---err', err);
              });
            break;

          default:
            break;
        }
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
      typeId: yTable.table.selectedNode?.id,
      // typeCode: yTable.table.selectedNode?.code,
      typeName: yTable.table.selectedNode?.name,
      parentId: yTable.table.dataRow?.dictId || 0,
      parentName: yTable.table.dataRow?.dictName,
    });
  };
  const addOptions = ['楼宇', '楼层', '房间', '床位'];
  const editOptions = ['', '楼宇', '楼层', '房间'];
  // 左侧弹窗设置修改
  const changeModalSort = async (type, visible, record) => {
    const { editType } = modalSortConfig;
    console.log('editType: ', editType);
    await modalFormSort.resetFields();
    setModalSortConfig({
      ...modalSortConfig,
      visible: visible,
      title:
        type === 'add'
          ? `新增${addOptions[modalSortConfig.editType]}`
          : type === 'edit'
          ? `编辑${addOptions[modalSortConfig.editType]}`
          : '',
      type: type,
    });
    if (type === 'add') {
      switch (editType) {
        // 楼宇
        case 0:
          modalFormSort.setFieldsValue({
            ...record,
          });
          break;
        // 楼层
        case 1:
          modalFormSort.setFieldsValue({
            ...record,
            buildingCode: yTable.table.selectedNode.code,
          });
          break;
        // 房间
        case 2:
          modalFormSort.setFieldsValue({
            ...record,
            floorCode: yTable.table.selectedNode.code,
            buildingCode: yTable.table.selectedNode.buildingCode,
          });
          break;
        // 床位
        case 3:
          modalFormSort.setFieldsValue({
            ...record,
            roomCode: yTable.table.selectedNode.code,
            roomName: yTable.table.selectedNode.name,
            floorCode: yTable.table.selectedNode.floorCode,
            floorName: yTable.table.selectedNode.floorName,
            buildingCode: yTable.table.selectedNode.buildingCode,
            buildingName: yTable.table.selectedNode.buildingName,
          });
          break;

        default:
          break;
      }
    }
    if (type === 'edit') {
      modalFormSort.setFieldsValue({
        ...record,
      });
    }
  };

  // 保存分类数据
  const formSave = async () => {
    const { editType } = modalSortConfig;
    const formData = await modalFormSort.validateFields();
    const params = {
      ...formData,
    };
    modalSortConfig.loading = true;
    setModalSortConfig({ ...modalSortConfig });
    if (modalSortConfig.type === 'add') {
      switch (editType) {
        case 0:
          bedBuildAdd(params)
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedBuildAdd: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;
        case 1:
          bedFloorAdd(params)
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedFloorAdd: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;
        case 2:
          bedRoomAdd(params)
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedRoomAdd: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;
        case 3:
          bedAdd({ ...params, useFlag: ~~formData?.useFlag })
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedAdd: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;

        default:
          break;
      }
    } else if (modalSortConfig.type === 'edit') {
      switch (editType) {
        case 0:
          bedBuildUpdate(params)
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedBuildUpdate: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;
        case 1:
          bedFloorUpdate(params)
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedFloorUpdate: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;
        case 2:
          bedRoomUpdate(params)
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedRoomUpdate: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;
        case 3:
          bedUpdate({ ...params, useFlag: ~~formData?.useFlag })
            .then((res) => {
              message.success(res?.msg);
              getTableData();
              modalSortConfig.visible = false;
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            })
            .catch((err) => {
              console.log('err-bedUpdate: ', err);
              modalSortConfig.loading = false;
              setModalSortConfig({ ...modalSortConfig });
            });
          break;

        default:
          break;
      }
    }
  };

  // 获取字典数据
  const getDictionaryData = () => {
    dictTypeSelectPullDown(['0002', '0003', '0004']).then((response) => {
      setBasic(response.data);
    });
  };

  // 获取楼宇下拉框数据
  const getBedBuildList = () => {
    bedBuildList().then((res) => {
      const opt =
        res?.data?.map((it) => {
          return { value: it.buildingCode, label: it.name };
        }) || [];
      setBuildingOpt(opt);
    });
  };

  // 获取楼层下拉框数据
  const getBedFloorList = () => {
    // { buildingCode: yTable.table.selectedNode?.buildingCode }
    bedFloorList().then((res) => {
      const opt =
        res?.data?.map((it) => {
          return { value: it.floorCode, label: it.name };
        }) || [];
      setFloorOpt(opt);
    });
  };

  // 获取房间下拉框数据
  const getBedRoomList = () => {
    // {
    //   buildingCode: yTable.table.selectedNode?.buildingCode,
    //   floorCode: yTable.table.selectedNode?.floorCode,
    // }
    bedRoomList().then((res) => {
      const opt =
        res?.data?.map((it) => {
          return { value: it.roomCode, label: it.name };
        }) || [];
      setRoomOpt(opt);
    });
  };
  const getOpt = () => {
    getBedBuildList();
    getBedFloorList();
    getBedRoomList();
  };
  useEffect(() => {
    getDictionaryData();

    getTreeData();
  }, []);
  return (
    <div>
      <Row className="flexNoWrap overflowXHidden margin0" type="flex">
        <Col flex="0 0 280px" className={styles.treeBox}>
          {/* <Form form={treeSearchForm} layout="vertical">
            <Form.Item label="" name="typeName" style={{ marginTop: '15px' }}>
              <Input onPressEnter={getTreeData} />
            </Form.Item>
          </Form>
          <Divider style={{ margin: 0 }} /> */}
          <Tree
            showIcon={false}
            treeData={treeData}
            defaultExpandAll
            className={styles.tree}
            onSelect={treeSelect}
            selectedKeys={yTable.table.selectedNode?.id ? [yTable.table.selectedNode?.id] : []}
          />
          {/* <div className={styles.treebtn}>
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
              delInfo{editOptions[modalSortConfig.editType]}
            </Button>
          </div> */}
        </Col>
        <Col flex="1 1 auto" style={{ overflowX: 'hidden' }}>
          <div className={styles.topForm}>
            <div className={styles.searchFormTips}>{addOptions[modalSortConfig.editType]}信息</div>
            <SearchForm searchForm={topRightForm} />
          </div>
          <div ref={tableRef} style={{ height: tableHeight }} className="yTableStyle">
            <YTable table={{ ...yTable.table, columns: columns(modalSortConfig) }} />
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
          onFinish={formSave}
          labelCol={{ flex: '100px' }}
          style={{ padding: '0 150px' }}
          initialValues={{ useFlag: 1 }}
        >
          {/* 楼宇 */}
          {modalSortConfig?.editType === 0 ? (
            <Row>
              <Form.Item name="id" hidden></Form.Item>
              <Col span={24}>
                <Form.Item label="楼宇编码" name="buildingCode" rules={[{ required: true }]}>
                  <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="楼宇名称" name="name" rules={[{ required: true }]}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          {/* 楼层 */}
          {modalSortConfig?.editType === 1 ? (
            <Row>
              <Form.Item name="id" hidden></Form.Item>
              <Col span={24}>
                <Form.Item
                  label="所属楼宇"
                  name="buildingCode"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={buildingOpt} disabled></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="楼层编码" name="floorCode" rules={[{ required: true }]}>
                  <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="楼层名称" name="name" rules={[{ required: true }]}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          {/* 房间 */}
          {modalSortConfig?.editType === 2 ? (
            <Row>
              <Form.Item name="id" hidden></Form.Item>
              <Col span={24}>
                <Form.Item
                  label="所属楼宇"
                  name="buildingCode"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={buildingOpt} disabled></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="所属楼层"
                  name="floorCode"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={floorOpt} disabled></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="房间编码" name="roomCode" rules={[{ required: true }]}>
                  <Input disabled={modalSortConfig.type === 'edit'} placeholder="请输入" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="房间名称" name="name" rules={[{ required: true }]}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="房间朝向"
                  name="roomToward"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={basic['0002'] || []}></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="房间类型"
                  name="roomType"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={basic['0003'] || []}></Select>
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          {/* 床位 */}
          {modalSortConfig?.editType === 3 ? (
            <Row>
              <Form.Item name="id" hidden></Form.Item>
              <Form.Item name="buildingName" hidden></Form.Item>
              <Form.Item name="floorName" hidden></Form.Item>
              <Form.Item name="roomName" hidden></Form.Item>
              <Col span={24}>
                <Form.Item
                  label="所属楼宇"
                  name="buildingCode"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={buildingOpt} disabled></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="所属楼层"
                  name="floorCode"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={floorOpt} disabled></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="所属房间"
                  name="roomCode"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={roomOpt} disabled></Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="床位编号" name="bedCode" rules={[{ required: true }]}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="床位名称" name="name" rules={[{ required: true }]}>
                  <Input placeholder="请输入" />
                </Form.Item>
              </Col>
              {/* <Col span={24}>
                <Form.Item
                  label="入住状态"
                  name="status"
                  rules={[{ required: false, message: '' }]}
                >
                  <Select placeholder="请选择" options={basic['0004'] || []}></Select>
                </Form.Item>
              </Col> */}
              <Col span={24}>
                <Form.Item name="useFlag" valuePropName="checked" style={{ marginLeft: 8 }}>
                  <Checkbox>
                    <span className={styles.labeltext}>启用</span>
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          ) : null}
        </Form>
      </Modal>
    </div>
  );
};
