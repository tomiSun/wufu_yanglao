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
  Tag,
} from 'antd';
const { RangePicker } = DatePicker;
import { DeleteOutlined } from '@ant-design/icons';
import { cookbookUpdate, cookbookSelect } from '@/services/syntheticModule/cookbook';
import { findValByKey, getDefaultOption } from '@/utils/common';
import { makeWb, pinyin } from 'yunyi-convert';
import { config } from '@/utils/const';
const { pageSize, pageNum } = config;
import { useTableHeight } from '@/utils/tableHeight';
const { TextArea } = Input;
import moment from 'moment';
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);

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
          title: '星期',
          dataIndex: 'dayOfWeek',
          align: 'left',
          ellipsis: true,
          width: 150,
          render: (text, record, index) => {
            return `${record?.dayOfWeek}(${record?.date})`;
          },
        },
        {
          title: '早餐',
          dataIndex: 'breakfast',
          ellipsis: true,
          align: 'left',
          width: 200,
          children: [
            {
              title: '主食',
              dataIndex: 'breakfastStapleFood',
              key: 'breakfastStapleFood',
              width: 100,
              render: (text, record, index) => {
                return (
                  <Select
                    // disabled
                    value={record.breakfastStapleFood}
                    mode="multiple"
                    showArrow={false}
                    tagRender={tagRender}
                    defaultValue={['2']}
                    style={{ width: '100%' }}
                    options={options}
                    onChange={(e, option) => {
                      record.breakfastStapleFood = e;
                      setYTable({ ...yTable });
                    }}
                  />
                );
              },
            },
            {
              title: '菜谱',
              dataIndex: 'breakfastMenu',
              key: 'breakfastMenu',
              width: 100,
              render: (text, record, index) => {
                return (
                  <Select
                    mode="multiple"
                    value={record.breakfastMenu}
                    showArrow={false}
                    tagRender={tagRender}
                    defaultValue={['4']}
                    style={{ width: '100%' }}
                    options={options}
                    onChange={(e, option) => {
                      record.breakfastStapleFood = e;
                      setYTable({ ...yTable });
                    }}
                  />
                );
              },
            },
          ],
        },
        {
          title: '午餐',
          dataIndex: 'lunch',
          ellipsis: true,
          align: 'left',
          width: 200,
          children: [
            {
              title: '主食',
              dataIndex: 'lunchStapleFood',
              key: 'lunchStapleFood',
              width: 100,
              render: (text, record, index) => {
                return (
                  <Select
                    mode="multiple"
                    value={record.lunchStapleFood}
                    showArrow={false}
                    tagRender={tagRender}
                    defaultValue={['1']}
                    style={{ width: '100%' }}
                    options={options}
                    onChange={(e, option) => {
                      record.breakfastStapleFood = e;
                      setYTable({ ...yTable });
                    }}
                  />
                );
              },
            },
            {
              title: '菜谱',
              dataIndex: 'lunchMenu',
              key: 'lunchMenu',
              width: 100,
              render: (text, record, index) => {
                return (
                  <Select
                    mode="multiple"
                    value={record.lunchMenu}
                    showArrow={false}
                    tagRender={tagRender}
                    defaultValue={['3']}
                    style={{ width: '100%' }}
                    options={options}
                    onChange={(e, option) => {
                      record.breakfastStapleFood = e;
                      setYTable({ ...yTable });
                    }}
                  />
                );
              },
            },
          ],
        },
        {
          title: '晚餐',
          dataIndex: 'dinner',
          ellipsis: true,
          align: 'left',
          width: 200,
          children: [
            {
              title: '主食',
              dataIndex: 'dinnerStapleFood',
              key: 'dinnerStapleFood',
              width: 100,
              render: (text, record, index) => {
                return (
                  <Select
                    mode="multiple"
                    value={record.dinnerStapleFood}
                    showArrow={false}
                    tagRender={tagRender}
                    defaultValue={['1']}
                    style={{ width: '100%' }}
                    options={options}
                    onChange={(e, option) => {
                      record.breakfastStapleFood = e;
                      setYTable({ ...yTable });
                    }}
                  />
                );
              },
            },
            {
              title: '菜谱',
              dataIndex: 'dinnerMeun',
              key: 'dinnerMeun',
              width: 100,
              render: (text, record, index) => {
                return (
                  <Select
                    mode="multiple"
                    value={record.dinnerMeun}
                    showArrow={false}
                    tagRender={tagRender}
                    defaultValue={['3']}
                    style={{ width: '100%' }}
                    options={options}
                    onChange={(e, option) => {
                      record.breakfastStapleFood = e;
                      setYTable({ ...yTable });
                    }}
                  />
                );
              },
            },
          ],
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
      selectInfo: (info) => {
        yTable.table.dataRow = info;
        setYTable({ ...yTable });
        addOrEdit('edit', true);
      },
    },
  });

  // 获取列表Table数据
  const getTableData = (startTime, endTime) => {
    // const { keyWord, businessNo, timeRange } = topFrom.getFieldsValue();
    // startTime = (startTime && `${startTime} 00:00:00`) || '';
    // endTime = (endTime && `${endTime} 23:59:59`) || '';
    const params = {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    cookbookSelect(params)
      .then((res) => {
        yTable.table.dataSource = res?.data || [];
        // [
        //   { id: Monday, week: `一 (${Monday})` },
        //   { id: Tuesday, week: `二 (${Tuesday})` },
        //   { id: Wednesday, week: `三 (${Wednesday})` },
        //   { id: Thursday, week: `四 (${Thursday})` },
        //   { id: Friday, week: `五 (${Friday})` },
        //   { id: Saturday, week: `六 (${Saturday})` },
        //   // { id: Sunday, week: `日 (${Sunday})` },
        //   {
        //     breakfastMenu: ['2'],
        //     breakfastStapleFood: ['4', '1'],
        //     createTime: '2021-08-08T09:58:04.304Z',
        //     creatorId: 0,
        //     date: '2021-08-08',
        //     dayOfWeek: '周日',
        //     dinnerMeun: [],
        //     dinnerStapleFood: [],
        //     id: 0,
        //     lunchMenu: [],
        //     lunchStapleFood: [],
        //     week: `日 (${Sunday})`,
        //   },
        // ];
        setYTable({ ...yTable });
        yTable.table.loading = false;
        yTable.table.pagination.current = res?.data?.pageNum;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('leaveManagementSelect---err', err);
      });
  };
  // 提交
  const cookbookUpdateService = (startTime, endTime) => {
    cookbookUpdate(yTable.table.dataSource)
      .then((res) => {
        message.success(res.msg);
        getTableData(week[0], week[6]);
      })
      .catch((err) => {
        console.log('cookbookUpdate---err', err);
      });
  };

  // -------------------------
  const options = [
    { value: '1', label: '米饭' },
    { value: '2', label: '面条' },
    { value: '3', label: '佛跳墙' },
    { value: '4', label: '回锅肉' },
  ];

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        // color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  const [time, setTime] = useState(moment());
  const [week, setWeek] = useState([]);
  useEffect(() => {
    if (time) {
      const Monday = moment(time).day(1).format('YYYY-MM-DD'); // 周一日期
      const Tuesday = moment(time).day(2).format('YYYY-MM-DD'); // 周二日期
      const Wednesday = moment(time).day(3).format('YYYY-MM-DD'); // 周三日期
      const Thursday = moment(time).day(4).format('YYYY-MM-DD'); // 周四日期
      const Friday = moment(time).day(5).format('YYYY-MM-DD'); // 周五日期
      const Saturday = moment(time).day(6).format('YYYY-MM-DD'); // 周六日期
      const Sunday = moment(time).day(7).format('YYYY-MM-DD'); // 周日日期
      setWeek([Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]);

      // yTable.table.dataSource = [
      //   { id: 1, week: Monday },
      //   { id: 2, week: Tuesday },
      //   { id: 3, week: Wednesday },
      //   { id: 4, week: Thursday },
      //   { id: 5, week: Friday },
      //   { id: 6, week: Saturday },
      //   { id: 7, week: Sunday },
      // ];

      getTableData(Monday, Sunday);
    }
  }, [time]);
  // 初始化
  useEffect(() => {
    // getDictionaryData();
    // getTableData();
  }, []);
  return (
    <div className={styles.bloodComposition}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <DatePicker
          value={time}
          onChange={(date, dateString) => {
            setTime(date);
            console.log('date, dateString: ', date, dateString);
          }}
          picker="week"
          style={{ margin: '15px 0' }}
        />
        <Button type="primary" style={{ marginLeft: '15px' }} onClick={cookbookUpdateService}>
          保存
        </Button>
      </div>

      <div ref={tableRef} style={{ height: tableHeight }} className="yTableStyle">
        <YTable {...yTable} />
      </div>
    </div>
  );
};
