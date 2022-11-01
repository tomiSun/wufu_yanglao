/**
 * Created by liulingli on 2017/7/4.
 * desc : 体温单
 */
import React, { Component } from 'react';
import qs from 'qs';
import { TemperatureChart } from './temperatureChart';

export class Temperature extends Component {
  constructor(props){
    super(props)
  }
  componentWillMount() {
    this.state = {
      beginDate: this.props.data.beginDate, //开始时间
      hospital: this.props.data.hospital, //医院
      patientInfoList: this.props.data.patientInfoList, //患者信息
      dayOps: this.props.data.dayOps, //术后/产后天数
      breathingList: this.props.data.breathingList, //呼吸次数
      xyList: this.props.data.xyList, //血压数据
      dayList: this.props.data.dayList, //住院天数
      dayMap: this.props.data.dayMap, //每日录入信息
      pointTime: this.props.data.pointTime, // 时间段录入信息
      loading: this.props.data.loading,
      hspName:''
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    /*
     * 时间改变则重新render
     */
    if (nextProps.patientList !== nextState.patientList) {
      this.setState({
        beginDate: nextProps.data.beginDate,
        hospital: nextProps.data.hospital,
        patientList: nextProps.data.patientList,
        dayOps: nextProps.data.dayOps,
        breathingList: nextProps.data.breathingList,
        dayList: nextProps.data.dayList,
        dayMap: nextProps.data.dayMap,
        pointTime: nextProps.data.pointTime,
        loading: nextProps.data.loading,
        hspName:''
      });
    }
  }
  // componentWillMount() {
  //   this.state = {
  //     data: this.props.data || { hspName: '西南医院' },
  //     patientList: {
  //       name: '胡定明', //姓名
  //       sex: '男', //性别
  //       age: '65', //年龄
  //       endemicName: '心内科', //科室
  //       bedNo: '123', //床号
  //       inpNo: 'Z23456', //住院号
  //     }, //病人信息
  //     beginDate: '2017-06-28', //开始时间,按今天倒推7天
  //     dayList: ['1', '2', '3', '4', '5', '6', '7'], //住院天数 共七条，没有的那天数据返回''
  //     dayOps: ['1', '2', '3', '4', '5', '6', '7'], //产后/术后天数 共七条，没有的那天数据返回''
  //     breathingList: [
  //       '60',
  //       '70',
  //       '65',
  //       '66',
  //       '56',
  //       '160',
  //       '70',
  //       '60',
  //       '70',
  //       '65',
  //       '66',
  //       '56',
  //       '60',
  //       '70',
  //       '60',
  //       '70',
  //       '65',
  //       '66',
  //       '56',
  //       '60',
  //       '70',
  //       '60',
  //       '70',
  //       '65',
  //       '66',
  //       '56',
  //       '60',
  //       '70',
  //       '60',
  //       '70',
  //       '65',
  //       '66',
  //       '56',
  //       '60',
  //       '70',
  //       '60',
  //       '70',
  //       '65',
  //       '66',
  //       '56',
  //       '60',
  //       '70',
  //     ], //呼吸 42条数据 某个时间点空值返回''
  //     xyList: ['60', '70', '65', '66', '56', '60', '70', '60', '70', '65', '66', '56', '60', '70'], //血压 14条，当天空值返回''
  //     dayMap: {
  //       "{name:'入量',units:'ml'}": ['', '', '', '', '', '44', ''],
  //       "{name:'出量',units:'ml'}": ['', '', '', '', '', '44', ''],
  //       "{name:'小便',units:'ml'}": ['', '', '', '', '', '44', ''],
  //       "{name:'大便',units:'次/日'}": ['', '', '', '', '', '44', ''],
  //       "{name:'体重',units:'kg'}": ['', '', '', '', '', '47.5', ''],
  //       "{name:'血氧饱和度',units:''}": ['', '', '', '', '', '47.5', ''],
  //       "{name:'过敏史',units:''}": ['', '', '', '', '', '47.5', ''],
  //     }, //每日录入信息
  //     pointTime: {
  //       // 疼痛
  //       // tt: [
  //       //   { dataTime: '2017-06-29 02:00:00', value: '9' },
  //       //   {
  //       //     dataTime: '2017-06-29 06:00:00',
  //       //     value: '8',
  //       //   },
  //       //   { dataTime: '2017-06-29 10:00:00', value: '7' },
  //       // ],
  //       // 心率
  //       // xl: [
  //       //   {
  //       //     dataTime: '2017-06-29 02:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 2,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '120',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 06:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 6,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '90',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 14:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 14,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '88',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 18:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 18,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '98',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 22:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 22,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '90',
  //       //     xlValue: '',
  //       //   },
  //       // ],
  //       // 脉搏
  //       mb: [
  //         {
  //           dataTime: '2017-06-28 22:00:00',
  //           date: '2017-06-28',
  //           hour: 22,
  //           mbValue: '',
  //           phValue: '',
  //           type: '',
  //           value: '160',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 06:00:00',
  //           date: '2017-06-29',
  //           hour: 6,
  //           mbValue: '',
  //           phValue: '',
  //           type: '',
  //           value: '160',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 14:00:00',
  //           date: '2017-06-29',
  //           hour: 14,
  //           mbValue: '',
  //           phValue: '',
  //           type: '',
  //           value: '100',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 18:00:00',
  //           date: '2017-06-29',
  //           hour: 18,
  //           mbValue: '',
  //           phValue: '',
  //           type: '',
  //           value: '120',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 22:00:00',
  //           date: '2017-06-29',
  //           hour: 22,
  //           mbValue: '',
  //           phValue: '',
  //           type: '',
  //           value: '150',
  //           xlValue: '',
  //         },
  //       ],
  //       // 事件
  //       // eventDatas: [
  //       //   {
  //       //     dataTime: '2017-06-29 14:00:00',
  //       //     date: '2017-06-30',
  //       //     hour: 2,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '呼吸心跳停止',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 14:00:00',
  //       //     date: '2017-06-30',
  //       //     hour: 2,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '请假',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-30 02:00:00',
  //       //     date: '2017-06-30',
  //       //     hour: 2,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '不升',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 02:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 2,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '入院',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 14:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 14,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '开呼吸机',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 22:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 22,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '关呼吸机',
  //       //     xlValue: '',
  //       //   },
  //       // ],
  //       // 温度
  //       wd: [
  //         {
  //           dataTime: '2017-06-28 22:00:00',
  //           date: '2017-06-28',
  //           hour: 22,
  //           mbValue: '',
  //           phValue: '36.5',
  //           type: 'ew', // 肛温
  //           value: '37.2',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 06:00:00',
  //           date: '2017-06-29',
  //           hour: 6,
  //           mbValue: '',
  //           phValue: '',
  //           type: 'ew', // 腋温
  //           value: '37',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 14:00:00',
  //           date: '2017-06-29',
  //           hour: 14,
  //           mbValue: '',
  //           phValue: '',
  //           type: 'ew', // 肛温
  //           value: '37.5',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 18:00:00',
  //           date: '2017-06-29',
  //           hour: 18,
  //           mbValue: '',
  //           phValue: '',
  //           type: 'ew', // 口温
  //           value: '37.4',
  //           xlValue: '',
  //         },
  //         {
  //           dataTime: '2017-06-29 22:00:00',
  //           date: '2017-06-29',
  //           hour: 22,
  //           mbValue: '',
  //           phValue: '',
  //           type: 'ew', // 口温
  //           value: '36.8',
  //           xlValue: '',
  //         },
  //       ],
  //       // hzfx: [
  //       //   {
  //       //     dataTime: '2017-06-29 14:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 14,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '66',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 18:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 18,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '66',
  //       //     xlValue: '',
  //       //   },
  //       // ],
  //       // respiratorDatas: [
  //       //   {
  //       //     dataTime: '2017-06-29 14:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 14,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '66',
  //       //     xlValue: '',
  //       //   },
  //       //   {
  //       //     dataTime: '2017-06-29 18:00:00',
  //       //     date: '2017-06-29',
  //       //     hour: 18,
  //       //     mbValue: '',
  //       //     phValue: '',
  //       //     type: '',
  //       //     value: '66',
  //       //     xlValue: '',
  //       //   },
  //       // ],
  //     }, // 时间段录入信息
  //     loading: false,
  //   };
  // }

  // componentDidMount() {
  //   let { beginDate, data } = this.state;
  //   this.fetchData(data, beginDate);
  // }

  // componentWillReceiveProps(nextProps, nextState) {
  //   if (nextProps.data !== nextState.data) {
  //     this.setState({
  //       data: nextProps.data,
  //       beginDate: nextProps.data.clinicDate,
  //     });
  //   }
  //   let { beginDate, data } = this.state;
  //   this.fetchData(data, beginDate);
  // }

  // /* 请求患者体温单数据 */
  // fetchData = (data, beginDate) => {
  //   return;
  //   let param = {
  //     patientId: data.patientId,
  //     visitId: data.clinicNo,
  //     hspCode: data.hspCode,
  //     timeType: 4,
  //     time: beginDate,
  //   };
  //   //console.log(param)
  //   fetch('/caseHistory/patientTemperature/getHspPatientTemperature', {
  //     method: 'POST',
  //     body: qs.stringify(param),
  //   }).then((response) => {
  //     if (response.success) {
  //       let data = eval('(' + response.data + ')');
  //       let patientList = data.data.patientsInfo;
  //       let dataList = data.data.dataList;
  //       let dayMap = data.data.dayMap;
  //       //console.log("beginDay:"+dataList.beginDay)
  //       this.setState({
  //         patientList: patientList || {},
  //         beginDate: dataList.beginDay,
  //         dayOps: dataList.dayOps || [],
  //         dayList: dataList.dayList || [],
  //         breathingList: dataList.breathingList || [],
  //         dayMap: dataList.dayMap || {},
  //         pointTime: dataList.pointTime || {},
  //         loading: false,
  //       });
  //     } else {
  //       this.setState({
  //         loading: false,
  //       });
  //       throw new Error(response.message);
  //     }
  //   });
  // };
  // /**
  //  * 改变开始时间
  //  */
  // changeBeginDay = (newDate) => {
  //   if (newDate !== this.state.beginDate) {
  //     let { data } = this.state;
  //     this.fetchData(data, newDate);
  //   }
  // };

  render() {
    console.log(this.props)
    // let {
    //   data,
    //   beginDate,
    //   patientList,
    //   dayOps,
    //   breathingList,
    //   xyList,
    //   dayList,
    //   dayMap,
    //   pointTime,
    // } = this.props.data;
    const {
    beginDate,
    patientInfoList,
    dayOps,
    breathingList,
    xyList,
    dayList,
    dayMap,
    pointTime,
    hspName
  } = this.state;
  console.log()
    return (
      <TemperatureChart
      beginDate={beginDate}
      hospital={hspName}
      patientList={patientInfoList}
      dayOps={dayOps}
      breathingList={breathingList}
      xyList={xyList}
      dayList={dayList}
      dayMap={dayMap}
      pointTime={pointTime}
      // changeBeginDay={this.changeBeginDay}
      loading={false}
    />
    );
  }
}
