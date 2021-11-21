import React, { useEffect } from 'react';
import { Row, Col, Button, Modal, Input, Form, DatePicker, Radio } from 'antd';
const { RangePicker } = DatePicker;
import {
  Chart001,
  Chart002,
  Chart003,
  Chart004,
  Chart005,
  Chart006,
  Chart007,
  Chart008,
  Chart009,
  Chart010,
  Chart011,
  Chart012,
  Chart013,
  Chart014,
  Chart015,
  Chart016,
  Chart017,
  Chart018,
  Chart019,
  Chart020,
  Chart021,
  Chart022,
  Chart023,
} from './BizChart/index';
import { useState } from 'react';
import moment from 'moment';
import './CustomBlockChart.less';
const dateFormat = 'YYYY-MM-DD';
const gutterArr = [
  { xs: 8, sm: 8, md: 16, lg: 16 },
  { xs: 8, sm: 8, md: 16, lg: 16 },
];
const ChartMap = (num, props) => {
  let mapList = {
    1: <Chart001 {...props} />,
    2: <Chart002 {...props} />,
    3: <Chart003 {...props} />,
    4: <Chart004 {...props} />,
    5: <Chart005 {...props} />,
    6: <Chart006 {...props} />,
    7: <Chart007 {...props} />,
    8: <Chart008 {...props} />,
    9: <Chart009 {...props} />,
    10: <Chart010 {...props} />,
    11: <Chart011 {...props} />,
    12: <Chart012 {...props} />,
    13: <Chart013 {...props} />,
    14: <Chart014 {...props} />,
    15: <Chart015 {...props} />,
    16: <Chart016 {...props} />,
    17: <Chart017 {...props} />,
    18: <Chart018 {...props} />,
    19: <Chart019 {...props} />,
    20: <Chart020 {...props} />,
    21: <Chart021 {...props} />,
    22: <Chart022 {...props} />,
    23: <Chart023 {...props} />,
  };
  return mapList[num];
};
import { queryBrokenLine, queryCake, selectCountInfo, querySource } from '@/services/countPage';
export default function IndexPage(props) {
  const { data, height = 360, mode } = props;
  const [cssTemData, setCssTemData] = useState(data);
  const [maxHeight, setmaxHeight] = useState(height);
  const [pickerType, setPickerType] = useState(['mode2', 'mode3'].includes(mode) ? 'month' : 'day');
  const [pickerDate, setPickerDate] = useState([
    moment(new Date(), dateFormat).subtract('month', 12),
    moment(new Date(), dateFormat),
  ]);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    getChartData({ pickerDate, pickerType });
  }, []);
  //解析数据的函数
  const renderCol = (arr, lastspanRadio) => {
    return (
      <>
        {arr.map((item, index) => {
          let spanRadio = (item.span / 24) * lastspanRadio; //横向的比率 和父级的所占比率有关
          return (
            <Col span={item.span}>
              {!!item.children ? (
                <Row gutter={gutterArr}>{renderCol(item.children, spanRadio)}</Row>
              ) : (
                <div
                  className="block"
                  style={{
                    height: (maxHeight * item.vheight) / 24,
                  }}
                  onClick={() => {
                    // handleBlockClick(item);
                  }}
                >
                  {/* <h2 style={{ borderRadius: 20, background: "#f2f2f2" }}>{`${item.temp}`}</h2> */}
                  {!!item.temp
                    ? ChartMap([item.temp], { ...item, pickerDate, pickerType, chartData })
                    : '暂未配置模版'}
                </div>
              )}
            </Col>
          );
        })}
      </>
    );
  };

  //获取图标信息
  const getChartData = (param) => {
    if (mode == 'mode1') {
      getCount(param);
    }
    if (mode == 'mode2') {
      getLine(param);
    }
    if (mode == 'mode3') {
      getCake(param);
    }
  };
  const getCount = async (p) => {
    let param = {
      startTime: p.pickerDate[0],
      endTime: p.pickerDate[1],
    };
    let res = await selectCountInfo(param);
    let resSource = await querySource(param);
    const { fromHsp, fromSociety, toHsp, toSociety } = resSource?.data || {};
    const {
      originalNum,
      inHospitalNum,
      outHospitalNum,
      stayHospitalNum,
      takeUpBed,
      disabilityNum,
      partialDisability,
      provideForOneself,
      takeMedicalNum
    } = res['data'];
    setChartData({
      '0001': String(originalNum),
      '0002': String(inHospitalNum),
      '0003': String(outHospitalNum),
      '0004': String(stayHospitalNum),
      '0005': String(takeUpBed),
      '0006': String(disabilityNum),
      '0007': String(partialDisability),
      '0008': String(provideForOneself),
      '0011': String(takeMedicalNum),
      '0009': [
        {
          type: '来源于社会人数',
          value: fromSociety,
        },
        {
          type: '来源于医院人数',
          value: fromHsp,
        },
      ],
      '0010': [
        {
          type: '来源于社会人数',
          value: toSociety,
        },
        {
          type: '来源于医院人数',
          value: toHsp,
        },
      ],
    });
  };
  const getLine = async (p) => {
    let param = {
      startTime: p.pickerDate[0],
      endTime: p.pickerDate[1],
      timeType: p.pickerType == 'year' ? '2' : '1',
    };
    let res = await queryBrokenLine(param);
    setChartData(res['data']);
  };
  const getCake = async (p) => {
    let param = {
      startTime: p.pickerDate[0],
      endTime: p.pickerDate[1],
      timeType: p.pickerType == 'year' ? '2' : '1',
    };

    let res = await queryCake(param);
    setChartData(res['data']);
  };
  return (
    <div className={'box2'} style={{ marginTop: 16 }}>
      {/* 动态模版2 */}
      <>
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
          <RangePicker
            allowClear={false}
            defaultValue={[moment(new Date(), dateFormat), moment(new Date(), dateFormat)]}
            picker={pickerType}
            locale={{ default: 'zh-CN' }}
            value={pickerDate}
            onChange={(value) => {
              setPickerDate(value);
              getChartData({ pickerDate: value, pickerType });
            }}
          />
          {['mode2', 'mode3'].includes(mode) && (
            <Radio.Group
              style={{ marginLeft: 20 }}
              value={pickerType}
              onChange={(value) => {
                setPickerType(value.target.value);
                getChartData({ pickerDate, pickerType: value.target.value });
              }}
            >
              {/* <Radio.Button value="week">周</Radio.Button> */}
              <Radio.Button value="month">月</Radio.Button>
              <Radio.Button value="year">年</Radio.Button>
            </Radio.Group>
          )}
        </div>

        {cssTemData.map((item) => {
          return (
            <div>
              <Row gutter={gutterArr}>{renderCol(item.children, item.span / 24)}</Row>
            </div>
          );
        })}
      </>
    </div>
  );
}
