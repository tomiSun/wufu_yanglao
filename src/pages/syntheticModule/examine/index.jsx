/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
/* eslint-disable import/first */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable } from 'yunyi-component';
import { Form, Modal, Input, Row, Col, message, Divider, DatePicker, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import {
  examineAdd,
  examineDel,
  examineSelect,
  examineUpdate,
  selectByName,
} from '@/services/syntheticModule/examine';
import { config } from '@/utils/const';
import { useTableHeight } from '@/utils/tableHeight';
import moment from 'moment';
import { excelExport, openModal } from '@/utils/ExcelExport';

const { pageSize } = config;
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
        placeholder: '请输入姓名',
        sort: 2,
        style: { width: '200px' },
        pressEnter: () => {
          getTableData();
        },
      },
    ],
    dateArr: [
      // {
      //   label: '考核时间',
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
        label: '考核时间',
        name: 'timeRange',
        config: {
          dateType: 'range',
          timeStart: moment().startOf('day'),
          timeEnd: moment().endOf('day'),
          showTime: false,
          onChange: (e) => {
            topFrom.setFieldsValue({ timeRange: e });
          },
        },
        style: { width: '220px' },
        sort: 1,
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
        style: { marginRight: '15px' },
        sort: 4,
        callback: () => {
          addOrEdit('add', true);
        },
      },
      {
        name: '打印',
        type: 'primary',
        sort: 5,
        style: { marginRight: '15px' },
        callback: () => {
          const { timeRange } = topFrom.getFieldsValue();
          const startTime = timeRange && timeRange[0] ? `${timeRange[0]} 00:00:00` : '';
          const endTime = timeRange && timeRange[1] ? `${timeRange[1]} 23:59:59` : '';
          openModal({
            url: '/jmreport/view/671213856670666752',
            params: { startTime, endTime },
          });
        },
      },
    ],
    layout: 'inline',
    form: topFrom,
    cls: 'opera',
    initialValues: {
      timeRange: [
        moment().startOf('day').format('YYYY-MM-DD'),
        // moment().subtract(90, 'days').format('YYYY-MM-DD'),
        moment().endOf('day').format('YYYY-MM-DD'),
      ],
    },
  };

  // modal配置项
  const [modalForm] = Form.useForm();

  // 基础字典数据
  const [basic, setBasic] = useState({});

  // table模块
  const [yTable, setYTable] = useState({
    table: {
      bordered: true,
      loading: false,
      dataSource: [],
      columns: [
        {
          title: '序号',
          dataIndex: 'sortNumber',
          ellipsis: true,
          align: 'left',
          width: 50,
          render: (text, record, index) => {
            console.log('yTable.table.pagination.pageSize: ', yTable.table.pagination.pageSize);
            console.log(
              'yTable.table.pagination.pageSize.current - 1: ',
              yTable.table.pagination.pageSize.current - 1,
            );
            return (
              index + 1 + yTable.table.pagination.pageSize * (yTable.table.pagination.current - 1)
            );
          },
        },
        {
          title: '科室',
          dataIndex: 'department',
          align: 'left',
          ellipsis: true,
          width: 150,
        },
        {
          title: '姓名',
          dataIndex: 'carerName',
          align: 'left',
          ellipsis: true,
          width: 100,
        },
        {
          title: '分数',
          dataIndex: 'score',
          align: 'left',
          ellipsis: true,
          width: 80,
        },
        {
          title: '备注（扣分原因，病事假）',
          dataIndex: 'remark',
          align: 'left',
          ellipsis: true,
          width: 200,
        },
        {
          title: '考核人',
          dataIndex: 'inspectionPeople',
          ellipsis: true,
          align: 'left',
          width: 80,
        },
        {
          title: '考核时间',
          dataIndex: 'inspectionTime',
          ellipsis: true,
          align: 'left',
          width: 150,
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
      scroll: { x: 940, y: '100%' },
      dataRow: {},
      rowKey: 'id',
      pagination: {
        current: 1,
        pageSize: pageSize,
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: (total) => {
          return `共 ${total} 条`;
        },
        onChange: (page, pageSize) => {
          console.log('changePage----', page, pageSize);
          yTable.table.pagination.current = page;
          yTable.table.pagination.pageSize = pageSize;
          getTableData();
        },
      },
      basic: {},
      oClick: (count) => {
        yTable.table.dataRow = count;
        setYTable({ ...yTable });
      },
    },
  });

  // 判断新增 / 编辑
  const [modeType, setModeType] = useState({
    type: null,
    visible: false,
    loading: false,
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
        inspectionTime: record?.inspectionTime && moment(record?.inspectionTime),
      });
    }
    changeModal(type, visible);
  };
  // 修改弹窗配置
  const changeModal = (type, visible) => {
    modeType.type = type;
    modeType.visible = visible;
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
          examineDel({ ids: record.id })
            .then((res) => {
              message.success(res.msg);
              yTable.table.dataRow = {};
              getTableData();
            })
            .catch((err) => {
              console.log('err-examineDel: ', err);
            });
        },
      });
    } else {
      message.error('请选中行');
    }
  };
  // 获取列表Table数据
  const getTableData = () => {
    const { keyWord, timeRange } = topFrom.getFieldsValue();
    const startTime = timeRange && timeRange[0] ? `${timeRange[0]} 00:00:00` : '';
    const endTime = timeRange && timeRange[1] ? `${timeRange[1]} 23:59:59` : '';
    const params = {
      name: keyWord,
      startTime,
      endTime,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    examineSelect(params)
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
        console.log('examineSelect---err', err);
      });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { inspectionTime } = formData;
    const query = {
      ...modalForm.getFieldsValue(),
      inspectionTime: inspectionTime && moment(inspectionTime).format('YYYY-MM-DD'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      examineAdd(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-examineAdd: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    } else {
      examineUpdate(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-examineUpdate: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    }
  };
  // 获取字典数据
  const getDictionaryData = () => {
    dictTypeSelectPullDown(['0005']).then((response) => {
      setBasic(response.data);
    });
  };
  const [nameOptions, setNameOptions] = useState([]);
  const getNameOptions = (e) => {
    selectByName({ carerName: e || '' })
      .then((res) => {
        const data =
          res?.data?.map((item) => {
            return { label: item?.name, value: item?.careCode };
          }) || [];
        setNameOptions(data);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  };
  // 初始化
  useEffect(() => {
    getDictionaryData();
    getTableData();
    getNameOptions();
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
        visible={modeType.visible}
        confirmLoading={modeType.loading}
        onOk={() => {
          modalForm.submit();
        }}
        onCancel={() => changeModal('', false)}
      >
        <Form
          name="basic"
          form={modalForm}
          labelCol={{ flex: '140px' }}
          onFinish={saveModalInfo}
          initialValues={{ inspectionTime: moment() }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Form.Item name="carerName" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="科室" name="department" rules={[{ required: true }]}>
                <Select placeholder="请选择" options={basic['0005'] || []}></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="姓名" name="careCode" rules={[{ required: true }]}>
                {/* <Input placeholder="请输入" /> */}
                <Select
                  showSearch
                  placeholder="请输入姓名"
                  onChange={(value, option) => {
                    console.log('value,option: ', value, option);
                    modalForm.setFieldsValue({ careCode: value, carerName: option.label });
                  }}
                  options={nameOptions}
                  filterOption={(inputValue, option) => {
                    return option.label.indexOf(inputValue) > -1;
                  }}
                ></Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="分数" name="score" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="考核人" name="inspectionPeople" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="考核时间" name="inspectionTime">
                <DatePicker format="YYYY-MM-DD" showTime={false} style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="备注" name="remark">
                <TextArea placeholder="扣分原因，病事假" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
