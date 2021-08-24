/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable } from 'yunyi-component';
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
import { DeleteOutlined } from '@ant-design/icons';
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import {
  wardroundAdd,
  wardroundDel,
  wardroundSelect,
  wardroundUpdate,
} from '@/services/syntheticModule/wardround';
import { findValByKey, getDefaultOption } from '@/utils/common';
import { config } from '@/utils/const';
const { pageSize, pageNum } = config;
import { useTableHeight } from '@/utils/tableHeight';
const { TextArea } = Input;
import moment from 'moment';
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
        placeholder: '请输入查房人姓名',
        sort: 2,
        style: { width: '200px' },
        pressEnter: (enter) => {
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
        label: '查房时间',
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
        // style: {  },
        sort: 2,
        callback: () => {
          addOrEdit('add', true);
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
          title: '查房时间',
          dataIndex: 'wardRoundTime',
          ellipsis: true,
          align: 'center',
          width: 150,
        },
        {
          title: '查房人',
          dataIndex: 'wardRounds',
          align: 'center',
          ellipsis: true,
          width: 160,
        },
        {
          title: '项目',
          dataIndex: 'number',
          align: 'center',
          ellipsis: true,
          width: 160,
          children: [
            {
              title: '生活照料',
              dataIndex: 'livingConditions',
              key: 'livingConditions',
              width: 200,
              children: [
                {
                  title: '发现情况摘要',
                  dataIndex: 'livingConditions',
                  key: 'livingConditions',
                  width: 100,
                },
                {
                  title: '处理意见',
                  dataIndex: 'lifeOpinion',
                  key: 'lifeOpinion',
                  width: 100,
                },
              ],
            },
            {
              title: '心理护理',
              dataIndex: 'psychologicalSituation',
              key: 'psychologicalSituation',
              width: 100,
              children: [
                {
                  title: '发现情况摘要',
                  dataIndex: 'psychologicalSituation',
                  key: 'psychologicalSituation',
                  width: 100,
                },
                {
                  title: '处理意见',
                  dataIndex: 'psychologicalOpinion',
                  key: 'psychologicalOpinion',
                  width: 100,
                },
              ],
            },
            {
              title: '后勤保障',
              dataIndex: 'logisticsSituation',
              key: 'logisticsSituation',
              width: 100,
              children: [
                {
                  title: '发现情况摘要',
                  dataIndex: 'logisticsSituation',
                  key: 'logisticsSituation',
                  width: 100,
                },
                {
                  title: '处理意见',
                  dataIndex: 'logisticsOpinion',
                  key: 'logisticsOpinion',
                  width: 100,
                },
              ],
            },
            {
              title: '安全隐患',
              dataIndex: 'securitySituation',
              key: 'securitySituation',
              width: 100,
              children: [
                {
                  title: '发现情况摘要',
                  dataIndex: 'securitySituation',
                  key: 'securitySituation',
                  width: 100,
                },
                {
                  title: '处理意见',
                  dataIndex: 'safetyAdvice',
                  key: 'safetyAdvice',
                  width: 100,
                },
              ],
            },
            {
              title: '环境卫生及其他',
              dataIndex: 'environmentalConditions',
              key: 'environmentalConditions',
              width: 100,
              children: [
                {
                  title: '发现情况摘要',
                  dataIndex: 'environmentalConditions',
                  key: 'environmentalConditions',
                  width: 100,
                },
                {
                  title: '处理意见',
                  dataIndex: 'environmentalOpinion',
                  key: 'environmentalOpinion',
                  width: 100,
                },
              ],
            },
            {
              title: '意见或建议',
              dataIndex: 'opinionSituation',
              key: 'opinionSituation',
              width: 100,
              children: [
                {
                  title: '发现情况摘要',
                  dataIndex: 'opinionSituation',
                  key: 'opinionSituation',
                  width: 100,
                },
                {
                  title: '处理意见',
                  dataIndex: 'opinion',
                  key: 'opinion',
                  width: 100,
                },
              ],
            },
          ],
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
      // selectInfo: (info) => {
      //   yTable.table.dataRow = info;
      //   setYTable({ ...yTable });
      //   addOrEdit('edit', true);
      // },
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
        wardRoundTime: record?.wardRoundTime && moment(record?.wardRoundTime),
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
    if (!!Object.getOwnPropertyNames(record).length) {
      Modal.confirm({
        title: '是否要删除该条数据',
        icon: <DeleteOutlined />,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        style: { padding: '30px' },
        onOk() {
          wardroundDel({ id: record.id })
            .then((res) => {
              message.success(res.msg);
              yTable.table.dataRow = {};
              getTableData();
            })
            .catch((err) => {
              console.log('err-wardroundDel: ', err);
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
      wardRounds: keyWord,
      startTime,
      endTime,
      pageNum: yTable.table.pagination.current,
      pageSize: yTable.table.pagination.pageSize,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    wardroundSelect(params)
      .then((res) => {
        yTable.table.dataSource = res?.data?.list || [];
        yTable.table.loading = false;
        yTable.table.pagination.current = res?.data?.pageNum;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('wardroundSelect---err', err);
      });
  };

  // 新增 / 修改 提交时触发
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const { wardRoundTime } = formData;
    let query = {
      ...modalForm.getFieldsValue(),
      wardRoundTime: wardRoundTime && moment(wardRoundTime).format('YYYY-MM-DD HH:mm:ss'),
    };
    modeType.loading = true;
    setModeType({ ...modeType });
    if (modeType.type === 'add') {
      wardroundAdd(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-wardroundAdd: ', err);
          modeType.loading = false;
          setModeType({ ...modeType });
        });
    } else {
      wardroundUpdate(query)
        .then((response) => {
          message.success(response.msg);
          modeType.visible = false;
          modeType.loading = false;
          setModeType({ ...modeType });
          getTableData();
        })
        .catch((err) => {
          console.log('err-wardroundUpdate: ', err);
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
  const caseList = [
    'livingConditions',
    'psychologicalSituation',
    'logisticsSituation',
    'securitySituation',
    'environmentalOpinion',
    'opinionSituation',
  ];
  const ideaList = [
    'lifeOpinion',
    'psychologicalOpinion',
    'logisticsOpinion',
    'safetyAdvice',
    'environmentalConditions',
    'opinion',
  ];
  const [yTableModal, setYTableModal] = useState({
    table: {
      bordered: true,
      loading: false,
      dataSource: [
        { id: 0, week: '生活照料' },
        { id: 1, week: '心理护理' },
        { id: 2, week: '后勤保障' },
        { id: 3, week: '安全隐患' },
        { id: 4, week: '环境卫生及其他' },
        { id: 5, week: '意见或建议' },
      ],
      columns: [
        {
          title: '项目',
          dataIndex: 'week',
          align: 'left',
          ellipsis: true,
          width: 150,
        },
        {
          title: '发现情况摘要',
          dataIndex: 'case',
          ellipsis: true,
          align: 'left',
          // width: 200,
          render: (text, record, index) => {
            return (
              <Form.Item label="" name={caseList[index]} rules={[{ required: true }]}>
                <TextArea autoSize={true} bordered={false} placeholder="请输入" />
              </Form.Item>
            );
          },
        },
        {
          title: '处置意见',
          dataIndex: 'idea',
          ellipsis: true,
          align: 'left',
          // width: 200,
          render: (text, record, index) => {
            // return <TextArea autoSize={true} bordered={false} placeholder="请输入" />;
            return (
              <Form.Item label="" name={ideaList[index]} rules={[{ required: true }]}>
                <TextArea autoSize={true} bordered={false} placeholder="请输入" />
              </Form.Item>
            );
          },
        },
      ],
      key: Math.random(),
      scroll: { y: '100%' },
      dataRow: {},
      rowKey: 'id',
      pagination: false,
      oClick: (count) => {
        yTableModal.table.dataRow = count;
        setYTableModal({ ...yTableModal });
      },
      selectInfo: (info) => {
        yTable.table.dataRow = info;
        setYTableModal({ ...yTable });
      },
    },
  });
  // 初始化
  useEffect(() => {
    getDictionaryData();
    getTableData();
  }, []);
  return (
    <div>
      <SearchForm searchForm={searchTopForm} />
      <div ref={tableRef} style={{ height: tableHeight }} className="yTableStyleHeadThereRow">
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
          labelCol={{ flex: '80px' }}
          onFinish={saveModalInfo}
          initialValues={{ wardRoundTime: moment() }}
        >
          <Form.Item name="id" hidden></Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="查房时间" name="wardRoundTime">
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={true}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="查房人" name="wardRounds" rules={[{ required: true }]}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </Row>
          <YTable {...yTableModal} />
        </Form>
      </Modal>
    </div>
  );
};
