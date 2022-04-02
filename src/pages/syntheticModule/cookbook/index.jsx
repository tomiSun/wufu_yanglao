import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { YTable } from 'yunyi-component';
import { message, Button, DatePicker, Select, Tag } from 'antd';
import { cookbookUpdate, cookbookSelect } from '@/services/syntheticModule/cookbook';
import { useTableHeight } from '@/utils/tableHeight';
import moment from 'moment';
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import { excelExport, openModal } from '@/utils/ExcelExport';
export default () => {
  // 获取表格高度
  const tableRef = useRef(null);
  const tableHeight = useTableHeight(tableRef);
  const [time, setTime] = useState(moment());
  const [week, setWeek] = useState([]);
  // table模块
  const [yTable, setYTable] = useState({
    table: {
      bordered: true,
      loading: false,
      dataSource: [],
      basic: {},
      columns: [
        {
          title: '星期',
          dataIndex: 'dayOfWeek',
          align: 'left',
          ellipsis: true,
          width: 100,
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
                    value={record.breakfastStapleFood}
                    mode="multiple"
                    showArrow={true}
                    showSearch={true}
                    notFoundContent={null}
                    filterOption={(inputValue, option) => {
                      return (
                        option?.label?.includes(inputValue) ||
                        option?.value?.includes(inputValue) ||
                        option?.pinyinCode?.includes(inputValue?.toUpperCase()) ||
                        option?.wubiCode?.includes(inputValue?.toUpperCase())
                      );
                    }}
                    tagRender={tagRender}
                    defaultValue={['2']}
                    style={{ width: '100%' }}
                    options={yTable?.table?.basic['0012'] || []}
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
                    showArrow={true}
                    showSearch={true}
                    notFoundContent={null}
                    filterOption={(inputValue, option) => {
                      return (
                        option?.label?.includes(inputValue) ||
                        option?.value?.includes(inputValue) ||
                        option?.pinyinCode?.includes(inputValue?.toUpperCase()) ||
                        option?.wubiCode?.includes(inputValue?.toUpperCase())
                      );
                    }}
                    tagRender={tagRender}
                    defaultValue={['4']}
                    style={{ width: '100%' }}
                    options={yTable?.table?.basic['0013'] || []}
                    onChange={(e, option) => {
                      record.breakfastMenu = e;
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
                    showArrow={true}
                    showSearch={true}
                    notFoundContent={null}
                    filterOption={(inputValue, option) => {
                      return (
                        option?.label?.includes(inputValue) ||
                        option?.value?.includes(inputValue) ||
                        option?.pinyinCode?.includes(inputValue?.toUpperCase()) ||
                        option?.wubiCode?.includes(inputValue?.toUpperCase())
                      );
                    }}
                    tagRender={tagRender}
                    defaultValue={['1']}
                    style={{ width: '100%' }}
                    options={yTable?.table?.basic['0012'] || []}
                    onChange={(e, option) => {
                      record.lunchStapleFood = e;
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
                    showArrow={true}
                    showSearch={true}
                    notFoundContent={null}
                    filterOption={(inputValue, option) => {
                      return (
                        option?.label?.includes(inputValue) ||
                        option?.value?.includes(inputValue) ||
                        option?.pinyinCode?.includes(inputValue?.toUpperCase()) ||
                        option?.wubiCode?.includes(inputValue?.toUpperCase())
                      );
                    }}
                    tagRender={tagRender}
                    defaultValue={['3']}
                    style={{ width: '100%' }}
                    options={yTable?.table?.basic['0013'] || []}
                    onChange={(e, option) => {
                      record.lunchMenu = e;
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
                    showArrow={true}
                    showSearch={true}
                    notFoundContent={null}
                    filterOption={(inputValue, option) => {
                      return (
                        option?.label?.includes(inputValue) ||
                        option?.value?.includes(inputValue) ||
                        option?.pinyinCode?.includes(inputValue?.toUpperCase()) ||
                        option?.wubiCode?.includes(inputValue?.toUpperCase())
                      );
                    }}
                    tagRender={tagRender}
                    defaultValue={['1']}
                    style={{ width: '100%' }}
                    options={yTable?.table?.basic['0012'] || []}
                    onChange={(e, option) => {
                      record.dinnerStapleFood = e;
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
                    showArrow={true}
                    showSearch={true}
                    notFoundContent={null}
                    filterOption={(inputValue, option) => {
                      return (
                        option?.label?.includes(inputValue) ||
                        option?.value?.includes(inputValue) ||
                        option?.pinyinCode?.includes(inputValue?.toUpperCase()) ||
                        option?.wubiCode?.includes(inputValue?.toUpperCase())
                      );
                    }}
                    tagRender={tagRender}
                    defaultValue={['3']}
                    style={{ width: '100%' }}
                    options={yTable?.table?.basic['0013'] || []}
                    onChange={(e, option) => {
                      record.dinnerMeun = e;
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
      scroll: { y: '100%' },
      dataRow: {},
      rowKey: 'id',
      pagination: false,
      oClick: (count) => {
        yTable.table.dataRow = count;
      },
    },
  });

  // 获取列表Table数据
  const getTableData = (startTime, endTime) => {
    const params = {
      startTime,
      endTime,
    };
    yTable.table.loading = true;
    yTable.table.dataSource = [];
    setYTable({ ...yTable });
    cookbookSelect(params)
      .then((res) => {
        yTable.table.dataSource =
          res?.data?.map((it) => {
            return {
              ...it,
              id: !it.id ? Math.random() : it.id,
            };
          }) || [];
        yTable.table.loading = false;
        yTable.table.pagination.current = res?.data?.pageNum;
        setYTable({ ...yTable });
      })
      .catch((err) => {
        yTable.table.loading = false;
        setYTable({ ...yTable });
        console.log('cookbookSelect---err', err);
      });
  };
  // 提交
  const cookbookUpdateService = () => {
    const data =
      yTable.table.dataSource?.map((it) => {
        return { ...it, id: parseFloat(it.id) > 1 ? it.id : '' };
      }) || [];
    cookbookUpdate({
      busMenuBatchUpdateInfos: data,
      startTime: week[0],
      endTime: week[1],
    })
      .then((res) => {
        message.success(res.msg);
        getTableData(week[0], week[1]);
      })
      .catch((err) => {
        console.log('cookbookUpdate---err', err);
      });
  };
  // 获取字典数据
  const getDictionaryData = () => {
    dictTypeSelectPullDown(['0012', '0013']).then((response) => {
      yTable.table.basic = response.data;
      setYTable({ ...yTable });
    });
  };
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

  useEffect(() => {
    if (time) {
      const Monday = moment(time).day(1).format('YYYY-MM-DD'); // 周一日期
      const Tuesday = moment(time).day(2).format('YYYY-MM-DD'); // 周二日期
      const Wednesday = moment(time).day(3).format('YYYY-MM-DD'); // 周三日期
      const Thursday = moment(time).day(4).format('YYYY-MM-DD'); // 周四日期
      const Friday = moment(time).day(5).format('YYYY-MM-DD'); // 周五日期
      const Saturday = moment(time).day(6).format('YYYY-MM-DD'); // 周六日期
      const Sunday = moment(time).day(7).format('YYYY-MM-DD'); // 周日日期
      setWeek([Monday, Sunday]);
      getTableData(Monday, Sunday);
    }
  }, [time]);
  // 初始化
  useEffect(() => {
    getDictionaryData();
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
        <Button
          type="primary"
          style={{ marginLeft: '15px' }}
          onClick={() => {
            // openModal({
            //   url: '/jmreport/view/655287228417380352',
            //   params: {
            //     businessNo: businessNos?.join(',') || '',
            //     buildingCode: SForm.getFieldValue('buildingCode') || '',
            //     floorCode: SForm.getFieldValue('floorCode') || '',
            //   },
            // });
          }}
        >
          打印
        </Button>
      </div>

      <div ref={tableRef} style={{ height: tableHeight }} className="yTableStyle">
        <YTable {...yTable} />
      </div>
    </div>
  );
};
