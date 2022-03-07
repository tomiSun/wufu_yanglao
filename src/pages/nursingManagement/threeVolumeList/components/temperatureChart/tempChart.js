/**
 * Created by liulingli on 2017/6/26.
 * desc : 体温单 定义绘制刻度方法
 */
import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';

/**
 * @method parseMapData 解析体温单每日录入数据
 * @param {JSON} mapData 每日录入数据字符串
 * @return
 * */
export function parseMapData(mapData) {
  const titleArray = [];
  const valueArray = [];
  for (const i in mapData) {
    const title = eval(`(${i})`);
    const value = mapData[i];
    titleArray.push(title);
    valueArray.push(value);
  }
  // 排序，name长的排在前面
  // 使用快速排序
  function bubbleSort(arr, aboutarr) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j].name.length < arr[j + 1].name.length) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          const aboutTemp = aboutarr[j];
          aboutarr[j] = aboutarr[j + 1];
          aboutarr[j + 1] = aboutTemp;
        }
      }
    }
    return {
      newArr: arr,
      newAboutArr: aboutarr,
    };
  }

  // let newTitleArray = bubbleSort(titleArray, valueArray).newArr;
  // let newValueArray = bubbleSort(titleArray, valueArray).newAboutArr;

  return {
    titleArray,
    valueArray,
  };
}

/**
 * @method getNewDate 根据传入时间，获取新的时间
 * @param {Object} dateStr 传入时间
 * @param {Number} dis 改变规则 ，-1为前一天，1为后一天，依次类推
 */
export function getNewDate(dateStr, dis) {
  // 判断是否Date()对象，如果不是转为Date对象
  let newDate;
  if (dateStr instanceof Date) {
    newDate = dateStr;
  } else {
    // 将字符串时间转化成Date对象
    newDate = new Date(dateStr.replace(/-/g, '/'));
  }

  const type = dis || 0;
  // 判断是否是合法的时间对象
  const dateParse = Date.parse(newDate);
  if (isNaN(dateParse)) {
    // 日期是否合法
    console.log('日期格式不合法');
    return; // 不合法时返回false
  }
  const year = newDate.getFullYear();
  const month = newDate.getMonth();
  const day = newDate.getDate();
  const finalDate = new Date(year, month, day + type);
  const finalYear = finalDate.getFullYear();
  const finalMonth =
    finalDate.getMonth() < 9 ? `0${finalDate.getMonth() + 1}` : finalDate.getMonth() + 1;
  const finalDay = finalDate.getDate() < 10 ? `0${finalDate.getDate()}` : finalDate.getDate();
  return `${finalYear}-${finalMonth}-${finalDay}`;
}

/*
 * @desc 绘制刻度
 * @param {obj} oJson 参数
 * @return svgArray
 * */
export function drawSvgScale(oJson) {
  const scaleArray = [];
  const { markName } = oJson; // 显示类型
  let { x } = oJson; // 标定线相对于SVG容器的x坐标
  const { beginKD } = oJson; // 开始刻度
  const { unit } = oJson; // 刻度单位
  const { title } = oJson; // 刻度标题
  const { endKD } = oJson; // 结束刻度
  const { width } = oJson; // 标线宽度
  const { disKD } = oJson; // 刻度差
  const { stepValue } = oJson; // 一刻度表示的值
  const { isShowLittle } = oJson; // 是否显示小刻度,默认不显示
  const { isShowdemarcate } = oJson; // 是否显示标定线,默认显示，
  const { demarcateId } = oJson; // 不显示时可以传入已存在标定线id，也可以不传
  const { trRowBegin } = oJson; // 相对于tr的开始行数
  const { trRowEnd } = oJson; // 相对于tr的结束行数
  const { valueShow } = oJson; // 是否隐藏刻度,默认不隐藏
  const { stepSide } = oJson; // 刻度画在标定线左边还是右边,true为左边，false为右边，默认true
  const { martchs } = oJson; // 匹配对齐
  const svgW = 100;
  const svgH = 15 * 40;
  const tdB = 1;
  const tdH = 15;
  const disRow = trRowEnd - trRowBegin;
  let disPX = (disRow * tdH) / ((endKD - beginKD) / disKD); // 一刻度需要多少像素px
  let endY = parseFloat(trRowEnd * tdH);
  x = typeof x === 'string' ? svgW * parseFloat(x) : x;
  if (martchs !== undefined) {
    // 华氏温度和摄氏温度换算时需要
    const scale = martchs.split(',')[0];
    const tdRegion = martchs.split(',')[1];
    const tdBegin = parseInt(tdRegion.split('-')[0]);
    const tdEnd = parseInt(tdRegion.split('-')[1]);
    const scale1 = parseInt(scale.split('-')[0]);
    const scale2 = parseInt(scale.split('-')[1]);
    const y1 = tdBegin * tdH;
    const y2 = tdEnd * tdH;
    disPX = parseFloat((y1 - y2) / ((scale2 - scale1) / disKD)).toFixed(2);
    if (scale1 > beginKD) {
      endY = parseFloat(y1) + parseFloat(((scale1 - beginKD) / disKD) * disPX);
    } else {
      endY = y1;
    }
  }
  // 当需要画标定线时
  if (isShowdemarcate) {
    const y1 = parseFloat(trRowEnd * tdH + parseFloat(disPX)).toFixed(2);
    const y2 = parseFloat(trRowBegin * tdH - 10).toFixed(2);
    scaleArray.push(
      <line
        key={0}
        id={demarcateId}
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        style={{ stroke: '#3c3c3c', strokeWidth: tdB }}
      />,
    );
  }
  scaleArray.push(
    <text
      key={'title'}
      type={`${markName}_line`}
      style={{ display: title ? '' : 'none' }}
      x={20}
      y={15}
      fill="#3c3c3c"
      value={title}
    >
      {title}
    </text>,
  );
  for (let i = 0; i <= (endKD - beginKD) / disKD; i++) {
    const len = (i + beginKD).toString().length;
    if (isShowLittle) {
      if (i % 5 === 0) {
        scaleArray.push(
          <line
            key={i + 1}
            max={beginKD}
            min={endKD}
            type={`${markName}_line`}
            x1={stepSide ? x - width : x + width}
            y1={parseFloat(endY - disPX * i).toFixed(2)}
            x2={x}
            y2={parseFloat(endY - disPX * i).toFixed(2)}
            style={{ stroke: '#3c3c3c', strokeWidth: tdB, display: 'none' }}
          />,
        );
      } else {
        scaleArray.push(
          <line
            key={i + 1}
            max={beginKD}
            min={endKD}
            type={`${markName}_line`}
            x1={stepSide ? x - width : x + width}
            y1={parseFloat(endY - disPX * i).toFixed(2)}
            x2={x}
            y2={parseFloat(endY - disPX * i).toFixed(2)}
            style={{ stroke: '#3c3c3c', strokeWidth: tdB }}
          />,
        );
      }
    } else {
      scaleArray.push(
        <line
          key={i + 1}
          max={beginKD}
          min={endKD}
          type={`${markName}_line`}
          x1={stepSide ? x - width : x + width}
          y1={parseFloat(endY - disPX * i).toFixed(2)}
          x2={x}
          y2={parseFloat(endY - disPX * i).toFixed(2)}
          style={{ stroke: '#3c3c3c', strokeWidth: tdB }}
        />,
      );
    }
    scaleArray.push(
      <text
        key={`${i + 1}markName`}
        type={`${markName}_line`}
        style={{ display: valueShow ? '' : 'none' }}
        x={stepSide ? x - (width + len * 8) : x + (width + 2)}
        y={parseFloat(endY - disPX * i + 4.5).toFixed(2)}
        fill="#3c3c3c"
        value={i * disKD + beginKD}
      >
        {i * disKD + beginKD}
        {unit}
      </text>,
    );
  }
  const b = 0;
  const e = (endKD - beginKD) / disKD;
  return {
    scaleArray,
    ySection: [parseFloat(endY - disPX * b).toFixed(2), parseFloat(endY - disPX * e).toFixed(2)],
  };
}

/**
 * 绘制图例
 * 疼痛 tt 红色正方形
 * 口温 kw 蓝色实心圆
 * 腋温 yw 蓝色叉叉
 * 耳温 ew 蓝色三角形
 * 肛温 gw 蓝色空心圆
 * 降温 jw 红色空心圆
 * 脉搏 mb 红色实心圆
 * 心率 xl 红色空心圆
 * */
export function showPointTuglie() {
  function showText(x, y, text, key) {
    return (
      <text key={y} x={x} y={y}>
        {text}
      </text>
    );
  }

  const oArray = ['tt', 'kw', 'yw', 'ew', 'gw', 'jw', 'mb', 'xl'];
  // 初始显示位置
  const initX = 16;
  const initTextX = 26;
  const initY = 15 * 1 + 30;
  const pTuglie = [];
  const textArray = [];
  for (let i = 0; i < oArray.length; i++) {
    const initTextY = initY + i * 16 + 4;
    switch (oArray[i]) {
      case 'tt':
        pTuglie.push(drawSquare('tt', { x: initX, y: initY + i * 16 }, 4, 'red', '疼痛', true));
        pTuglie.push(showText(initTextX, initTextY, '疼痛'));
        break; // 疼痛
      case 'kw':
        pTuglie.push(drawCircle('hx', { x: initX, y: initY + i * 16 }, 4, 'blue', '口温', true));
        pTuglie.push(showText(initTextX, initTextY, '口温'));
        break; // 口温
      case 'yw':
        pTuglie.push(drawCross('yw', { x: initX, y: initY + i * 16 }, 4, 'blue', '腋温'));
        pTuglie.push(showText(initTextX, initTextY, '腋温'));
        break; // 腋温
      case 'ew':
        pTuglie.push(drawCross('ew', { x: initX, y: initY + i * 16 }, 4, 'blue', '耳温'));
        pTuglie.push(showText(initTextX, initTextY, '耳温'));
        break; // 耳温
      case 'gw':
        pTuglie.push(drawCircle('gw', { x: initX, y: initY + i * 16 }, 4, 'blue', '肛温', false));
        pTuglie.push(showText(initTextX, initTextY, '肛温'));
        break; // 肛温
      case 'jw':
        pTuglie.push(drawCircle('jw', { x: initX, y: initY + i * 16 }, 4, 'red', '降温', false));
        pTuglie.push(showText(initTextX, initTextY, '降温'));
        break; // 降温
      case 'mb':
        pTuglie.push(drawCircle('mb', { x: initX, y: initY + i * 16 }, 4, 'red', '脉搏', true));
        pTuglie.push(showText(initTextX, initTextY, '脉搏'));
        break; // 脉搏
      case 'xl':
        pTuglie.push(drawCircle('xl', { x: initX, y: initY + i * 16 }, 4, 'red', '心率', false));
        pTuglie.push(showText(initTextX, initTextY, '心率'));
        break; // 心率
      default:
        break;
    }
  }
  return pTuglie;
}

/**
 * @method drawEvent 绘制事件
 * @param {Array} evenArray 事件数组
 * */
export function drawEvent(evenArray, curDate) {
  if (evenArray === undefined || evenArray.length === 0) {
    return;
  }
  const svgW = 15 * 42;
  const svgH = 15 * 40;
  const tdW = 15; // 获取td的宽度
  const daysW = 15 * 6; // 一天的显示的宽度
  const chinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const height = 15;
  // 按时间分组，显示在同一时间段
  const timeArray = {};
  const otherArray = [];
  for (let i = 0; i < evenArray.length; i++) {
    const { value } = evenArray[i];
    // let dataTime = evenArray[i].dataTime;
    const dataTime = `${evenArray[i].date} ${evenArray[i].hour}:00`;
    if (value !== '开呼吸机' && value !== '关呼吸机' && value !== '不升') {
      if (timeArray[dataTime] === undefined) {
        timeArray[dataTime] = [];
        timeArray[dataTime].push(evenArray[i]);
      } else {
        timeArray[dataTime].push(evenArray[i]);
      }
    } else {
      otherArray.push(evenArray[i]);
    }
  }
  // 生成HTML
  const showArray = [];
  const xPxArray = [];
  for (const time in timeArray) {
    const evens = timeArray[time];
    const xPx = getDisDays(curDate, time) * daysW - 5.5;
    let show = '';
    let k = 0;
    for (let j = 0; j < evens.length; j++) {
      const curEven = evens[j];
      const { value } = curEven;
      const hour = parseInt(moment(curEven.dataTime).format('HH'));
      const minute = parseInt(moment(curEven.dataTime).format('ss'));
      const hourStr = hour.toString();
      const minuteStr = minute.toString();
      let finalValue = '';
      const isLeave = value === '请假';
      if (minute > 0) {
        finalValue =
          value +
          (isLeave
            ? ''
            : `||${numToChinese(hourStr, chinese)}时${numToChinese(minuteStr, chinese)}分`);
      } else {
        finalValue = value + (isLeave ? '' : `||${numToChinese(hourStr, chinese)}时整`);
      }
      if (k === 0) {
        show += finalValue;
      } else {
        show += ` ${finalValue}`;
      }
      k++;
    }
    showArray.push(show);
    xPxArray.push(xPx);
  }
  // 绘制事件
  const reShowArray = [];
  for (let i = 0; i < showArray.length; i++) {
    // 绘制path
    const xPx = xPxArray[i];
    const textArray = showArray[i].split('');
    reShowArray.push(
      <svg key={i}>
        {textArray.map((v, i) => {
          return (
            <text
              style={{ fontSize: v === '|' ? '13px' : '' }}
              key={i}
              x={v === '|' ? xPx + 4 : xPx}
              y={12 + i * height}
              fill="red"
            >
              {v}
            </text>
          );
        })}
      </svg>,
    );
  }
  // 绘制其他事件
  for (let i = 0; i < otherArray.length; i++) {
    const { value } = otherArray[i];
    const time = otherArray[i].dataTime;
    // console.log("绘制其他事件"+curDate)
    const xPx = getDisDays(curDate, time) * daysW;
    if (value === '开呼吸机') {
      // 绘制向上的箭头
      reShowArray.push(drawArrow({ x: xPx, y: 40 * height }, 3 * height, true, 'blue'));
      // 在箭头旁边绘制呼吸机三字
      const textArray = ['呼', '吸', '机'];
      for (let j = 0; j < textArray.length; j++) {
        reShowArray.push(
          <text key={`j${j}`} x={xPx - 14} y={43 * height + j * 15 - 2} fill="blue">
            {textArray[j]}
          </text>,
        );
      }
    } else if (value === '关呼吸机') {
      // 绘制向下的箭头
      reShowArray.push(drawArrow({ x: xPx, y: 40 * height }, 3 * height, false, 'blue'));
    } else if (value === '不升') {
      const valueArray = value.split('');
      // 显示在35度下面
      const cy = 40 * height;
      for (let k = 0; k < valueArray.length; k++) {
        reShowArray.push(
          <text key={`${xPx}bs${k}`} x={xPx - 5.5} y={cy + height * k + 12} fill="#000">
            {valueArray[k]}
          </text>,
        );
      }
    }
  }
  return reShowArray;
}

/**
 * @method 绘制辅助呼吸
 * @param {Array} hzhxData 疼痛数组
 * */
export function drawHzhx(hzhxData, curDate) {
  const svgW = 15 * 42;
  const svgH = 15 * 40;
  const tdW = 15; // td的宽度
  const tdH = 15; // td的高度
  const daysW = 15 * 6; // 一天的显示的宽度

  // 以疼痛刻度10为基准
  const cy1 = 15 * 40 - 2;
  const cy2 = 15 * 42 + 12;
  const hxArray = [];
  for (let i = 0; i < hzhxData.length; i++) {
    const endDate = hzhxData[i].dataTime;
    const { value } = hzhxData[i];
    const title = `辅助呼吸：${value}次`;
    const y = i % 2 === 0 ? cy1 : cy2;
    // console.log("辅助呼吸"+curDate)
    const xPx = getDisDays(curDate, endDate) * daysW;
    hxArray.push(drawText({ x: xPx, y }, 'blue', value, title));
  }
  return hxArray;
}

/**
 * @method parseRePoint 解析是否存在重合的坐标点，若有请假事件，则将其分组，获取脉搏短促多边形
 * @param {JSON} pointData 时间录入信息
 * @param {String} curDate 当前时间
 * @return
 */
export function parseRePoint(pointData, curDate) {
  const height = 15;
  const mb = pointData.mb?.filter((it) => !!it.value) || []; // 脉搏
  const xl = pointData.xl || []; // 心率
  const wd = pointData.wd?.filter((it) => !!it.value) || []; // 温度
  const tt = pointData.tt || []; // 疼痛
  const events = pointData.evenDatas || []; // 事件
  const leaveEvents = []; // 缓存请假事件
  // 绘制点、折线、脉搏短促
  const pointArray = [];
  const wdYSection = drawSvgScale({
    markName: 'wd',
    svgId: 'svgLeft',
    x: '0.5',
    beginKD: 35,
    endKD: 42,
    width: 10,
    disKD: 1,
    trRowBegin: 1,
    trRowEnd: 35,
    stepSide: false,
    valueShow: true,
    isShowdemarcate: true,
    // martchs: '40-35,15-40',
  }).ySection;
  const mbYSection = drawSvgScale({
    markName: 'mb',
    svgId: 'svgLeft',
    x: '0.5',
    beginKD: 40,
    endKD: 180,
    width: 10,
    disKD: 20,
    // stepValue: 20,
    trRowBegin: 2,
    trRowEnd: 36,
    stepSide: true,
    valueShow: true,
    isShowdemarcate: true,
    // martchs: '140-40,15-40',
  }).ySection;
  const ttYSection = drawSvgScale({
    markName: 'tk',
    x: '1',
    stepSide: true,
    valueShow: false,
    beginKD: 1,
    endKD: 10,
    width: 10,
    disKD: 1,
    trRowBegin: 40,
    trRowEnd: 54,
    isShowdemarcate: false,
  }).ySection;

  // 统计请假事件
  for (let i = 0; i < events.length; i++) {
    const { value } = events[i];
    const { dataTime } = events[i];
    if (value === '请假') {
      leaveEvents.push(dataTime);
    }
  }
  const mbGroup = splitGroup(leaveEvents, mb);
  const xlGroup = splitGroup(leaveEvents, xl);
  const wdGroup = splitGroup(leaveEvents, wd);
  console.log('wdGroup: ', wdGroup);
  const ttGroup = splitGroup(leaveEvents, tt);

  // 计算脉搏点
  const mbPoints = [];
  const xlPoints = [];
  const wdPoints = [];
  const ttPoints = [];
  for (let i = 0; i < mbGroup.length; i++) {
    const mbArray = mbGroup[i];
    const xlArray = xlGroup[i];
    const wdArray = wdGroup[i];
    const ttArray = ttGroup[i];
    mbPoints[i] = [];
    xlPoints[i] = [];
    wdPoints[i] = [];
    ttPoints[i] = [];
    for (let j = 0; j < mbArray.length; j++) {
      const xy = getXY(mbArray[j], curDate, 40, 180, mbYSection);
      mbPoints[i].push(xy);
    }
    for (let j = 0; j < xlArray.length; j++) {
      const xy = getXY(xlArray[j], curDate, 40, 180, mbYSection);
      xlPoints[i].push(xy);
    }
    for (let j = 0; j < wdArray.length; j++) {
      const xy = getXY(wdArray[j], curDate, 35, 42, wdYSection);
      wdPoints[i].push(xy);
    }
    for (let j = 0; j < ttArray.length; j++) {
      const xy = getXY(ttArray[j], curDate, 1, 10, ttYSection);
      ttPoints[i].push(xy);
    }
  }
  // 获取 温度等于42°C时的y轴值，如果温度大于42°,即y值小于wdMax，则绘制向上的箭头
  const wdMax = wdYSection[1];
  // 绘制物理降温
  // for (let i = 0; i < wdPoints.length; i++) {
  //   let wdPoint = wdPoints[i];
  //   for (let j = 0; j < wdPoint.length; j++) {
  //     let value = wdPoint[j].value; //温度
  //     let phValue = wdPoint[j].point.phValue; //物理降温
  //     let yPx = wdPoint[j].y;
  //     let xPx = wdPoint[j].x;
  //     if (phValue !== undefined && phValue !== '') {
  //       if (value > 42) {
  //         yPx = wdMax;
  //       }
  //       //获取物理降温的坐标
  //       let wljwY = getXY(wdPoint[j].point, curDate, 35, 42, wdYSection, true).y;
  //       pointArray.push(
  //         <g
  //           key={'wljwPath' + xPx}
  //           name="wljw"
  //           style={{ fill: 'none', stroke: 'red', stokeWidth: '2px' }}
  //         >
  //           <path strokeDasharray="3,3" d={'M' + xPx + ' ' + yPx + ' ' + xPx + ' ' + wljwY} />
  //         </g>,
  //       );
  //       if (value !== phValue) {
  //         pointArray.push(
  //           drawCircle(
  //             'wljw',
  //             {
  //               x: xPx,
  //               y: wljwY,
  //             },
  //             4,
  //             'red',
  //             '物理降温:' + phValue + '°C',
  //             false,
  //           ),
  //         );
  //       }
  //     }
  //   }
  // }
  // 绘制折线图
  // 判断点是否重合
  const coor = [];
  for (let i = 0; i < mbPoints.length; i++) {
    const xlPoint = xlPoints[i];
    const mbPoint = mbPoints[i];
    const wdPoint = wdPoints[i];
    const ttPoint = ttPoints[i];
    // 定义折线path
    let xlPath = '';
    let mbPath = '';
    let wdPath = '';
    let ttPath = '';
    coor[i] = {};
    for (let j = 0; j < xlPoint.length; j++) {
      const { x } = xlPoint[j];
      const { y } = xlPoint[j];
      coor[i][x] = coor[i][x] || {};
      coor[i][x].xl = xlPoint[j];
      if (xlPath === '') {
        xlPath += `M${x},${y}`;
      } else {
        xlPath += `L${x},${y}`;
      }
    }
    for (let j = 0; j < mbPoint.length; j++) {
      const { x } = mbPoint[j];
      const { y } = mbPoint[j];
      coor[i][x] = coor[i][x] || {};
      coor[i][x].mb = mbPoint[j];
      if (mbPath === '') {
        mbPath += `M${x},${y}`;
      } else {
        mbPath += `L${x},${y}`;
      }
    }
    for (let j = 0; j < wdPoint.length; j++) {
      const { x } = wdPoint[j];
      const { y } = wdPoint[j];
      coor[i][x] = coor[i][x] || {};
      coor[i][x].wd = wdPoint[j];
      if (wdPath === '') {
        wdPath += `M${x},${y}`;
      } else {
        wdPath += `L${x},${y}`;
      }
    }
    for (let j = 0; j < ttPoint.length; j++) {
      const { x } = ttPoint[j];
      const { y } = ttPoint[j];
      coor[i][x] = coor[i][x] || {};
      coor[i][x].tt = ttPoint[j];
      if (ttPath === '') {
        ttPath += `M${x},${y}`;
      } else {
        ttPath += `L${x},${y}`;
      }
    }
    pointArray.push(
      <path key={`pathXL${i}`} stroke="red" strokeWidth="2" fill="none" d={xlPath} />,
    );
    pointArray.push(
      <path key={`pathMB${i}`} stroke="red" strokeWidth="2" fill="none" d={mbPath} />,
    );
    pointArray.push(
      <path key={`pathWD${i}`} stroke="blue" strokeWidth="2" fill="none" d={wdPath} />,
    );
    pointArray.push(
      <path key={`pathTT${i}`} stroke="blue" strokeWidth="2" fill="none" d={ttPath} />,
    );
  }
  for (let i = 0; i < coor.length; i++) {
    const json = coor[i];
    for (const j in json) {
      if (!json[j].mb) {
        json[j].mb = {};
      }
      if (!json[j].xl) {
        json[j].xl = {};
      }
      if (!json[j].wd) {
        json[j].wd = {};
      }
      if (!json[j].tt) {
        json[j].tt = {};
      }
      // console.log(json[j].wd)
      const mbY = json[j].mb.y;
      const xlY = json[j].xl.y;
      const wdY = json[j].wd.y;
      const ttY = json[j].tt.y;
      // console.log("mb:"+mbY+"xl:"+xlY+"wd:"+wdY);
      const yw = json[j].wd.type === 'yw'; // 腋温
      const ew = json[j].wd.type === 'ew'; // 腋温
      const kw = json[j].wd.type === 'kw'; // 口温
      const gw = json[j].wd.type === 'gw'; // 肛温
      // 判断是否重合
      const ismbxlwd = mbY && xlY; // 脉搏+心率+温度点都存在
      const ismbxl = mbY && xlY; // 脉搏+心率点都存在
      const ismbwd = mbY && wdY; // 脉搏+温度点都存在
      const isxlwd = xlY && wdY; // 心率+温度点都存在
      const istt = ttY;
      const iswd = wdY;
      if (ismbxlwd && mbY === xlY && xlY === wdY && gw) {
        // 脉搏+心率+肛温[红圆+红圈+蓝圈]：两个圈在外围（红圈在最外层表示心率，篮圈在里层表示肛温）、一个圆在中间（红圆表示脉搏）
        const title = `脉搏：${json[j].xl.value}次，心率：${json[j].xl.value}次,肛温：${json[j].wd.value}°C`;
        pointArray.push(drawCircle('gw', { x: j, y: xlY }, 7, 'blue', title, false));
        pointArray.push(drawCircle('mb', { x: j, y: xlY }, 3, 'red', title, true));
      } else if (ismbxlwd && mbY === xlY && xlY === wdY && yw) {
        // 脉搏+心率+腋温[红圆+红圈+蓝叉]：红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝叉在中间红圆之上（表示腋温）
        const title = `脉搏：${json[j].xl.value}次，心率：${json[j].xl.value}次,腋温：${json[j].wd.value}°C`;
        pointArray.push(drawCircle('mb', { x: j, y: xlY }, 7, 'red', title, true));
        pointArray.push(drawCross('yw', { x: j, y: xlY }, 3, 'blue', title));
      } else if (ismbxlwd && mbY === xlY && xlY === wdY && ew) {
        // 脉搏+心率+腋温[红圆+红圈+蓝叉]：红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝叉在中间红圆之上（表示腋温）
        const title = `脉搏：${json[j].xl.value}次，心率：${json[j].xl.value}次,腋温：${json[j].wd.value}°C`;
        pointArray.push(drawCircle('mb', { x: j, y: xlY }, 7, 'red', title, true));
        pointArray.push(drawCross('ew', { x: j, y: xlY }, 3, 'blue', title));
      } else if (ismbxlwd && mbY === xlY && xlY === wdY && kw) {
        // 脉搏+心率+口温[红圆+红圈+蓝圆]：红圈在外围（表示心率）、红圆在中间（表示脉搏）、蓝圆在中间红圆之上（表示口温）
        const title = `脉搏：${json[j].xl.value}次，心率：${json[j].xl.value}次,口温：${json[j].wd.value}°C`;
        pointArray.push(drawCircle('mb', { x: j, y: xlY }, 7, 'red', title, true));
        pointArray.push(drawCircle('kw', { x: j, y: xlY }, 3, 'blue', title, true));
      } else if (isxlwd && xlY === wdY && gw) {
        // 心率+肛温[红圈+蓝圈]
        const title = `心率：${json[j].xl.value}次，肛温：${json[j].wd.value}°C`;
        if (xlY && wdY) {
          pointArray.push(drawCircle('gw', { x: j, y: xlY }, 7, 'red', title, false));
          pointArray.push(drawCircle('mb', { x: j, y: xlY }, 3, 'blue', title, false));
        }
        mbY &&
          pointArray.push(
            drawCircle(
              'mb',
              {
                x: j,
                y: mbY,
              },
              4,
              'red',
              `脉搏：${json[j].mb.value}次`,
              true,
            ),
          ); // 脉搏
      } else if (isxlwd && xlY === wdY && yw) {
        // 心率+腋温[红圈+蓝叉]]
        const title = `心率：${json[j].xl.value}次，腋温：${json[j].wd.value}°C`;
        if (xlY && wdY) {
          pointArray.push(drawCircle('mb', { x: j, y: xlY }, 7, 'red', title, false));
          pointArray.push(drawCross('yw', { x: j, y: xlY }, 4, 'blue', title));
        }
        mbY &&
          pointArray.push(
            drawCircle(
              'mb',
              {
                x: j,
                y: mbY,
              },
              4,
              'red',
              `脉搏：${json[j].mb.value}次`,
              true,
            ),
          ); // 脉搏
      } else if (isxlwd && xlY === wdY && ew) {
        // 心率+腋温[红圈+蓝叉]]
        const title = `心率：${json[j].xl.value}次，腋温：${json[j].wd.value}°C`;
        if (xlY && wdY) {
          pointArray.push(drawCircle('mb', { x: j, y: xlY }, 7, 'red', title, false));
          pointArray.push(drawCross('ew', { x: j, y: xlY }, 4, 'blue', title));
        }
        mbY &&
          pointArray.push(
            drawCircle(
              'mb',
              {
                x: j,
                y: mbY,
              },
              4,
              'red',
              `脉搏：${json[j].mb.value}次`,
              true,
            ),
          ); // 脉搏
      } else if (isxlwd && xlY === wdY && kw) {
        // 心率+口温[红圈+蓝圆]
        const title = `心率：${json[j].xl.value}次，口温：${json[j].wd.value}°C`;
        if (xlY && wdY) {
          pointArray.push(drawCircle('xl', { x: j, y: xlY }, 7, 'red', title, false));
          pointArray.push(drawCircle('kw', { x: j, y: xlY }, 3, 'blue', title, true));
        }
        mbY &&
          pointArray.push(
            drawCircle(
              'mb',
              {
                x: j,
                y: mbY,
              },
              4,
              'red',
              `脉搏：${json[j].mb.value}次`,
              true,
            ),
          ); // 脉搏
      } else if (ismbwd && mbY === wdY && gw) {
        // 脉搏+肛温[红圆+蓝圈]
        const title = `脉搏：${json[j].mb.value}次，肛温：${json[j].wd.value}°C`;
        if (mbY && wdY) {
          pointArray.push(drawCircle('gw', { x: j, y: mbY }, 7, 'red', title, false));
          pointArray.push(drawCircle('mb', { x: j, y: mbY }, 3, 'blue', title, false));
        }
        xlY &&
          pointArray.push(
            drawCircle(
              'xl',
              {
                x: j,
                y: xlY,
              },
              4,
              'red',
              `心率：${json[j].xl.value}次`,
              false,
            ),
          ); // 心率
      } else if (ismbwd && mbY === wdY && yw) {
        // 脉搏+腋温[红圆+蓝叉]
        const title = `脉搏：${json[j].mb.value}次，腋温：${json[j].wd.value}°C`;
        if (mbY && wdY) {
          pointArray.push(drawCircle('mb', { x: j, y: mbY }, 7, 'red', title, false));
          pointArray.push(drawCross('yw', { x: j, y: mbY }, 4, 'blue', title));
        }
        xlY &&
          pointArray.push(
            drawCircle(
              'xl',
              {
                x: j,
                y: xlY,
              },
              4,
              'red',
              `心率：${json[j].xl.value}次`,
              false,
            ),
          ); // 心率
      } else if (ismbwd && mbY === wdY && ew) {
        // 脉搏+腋温[红圆+蓝叉]
        const title = `脉搏：${json[j].mb.value}次，腋温：${json[j].wd.value}°C`;
        if (mbY && wdY) {
          pointArray.push(drawCircle('mb', { x: j, y: mbY }, 7, 'red', title, false));
          pointArray.push(drawCross('ew', { x: j, y: mbY }, 4, 'blue', title));
        }
        xlY &&
          pointArray.push(
            drawCircle(
              'xl',
              {
                x: j,
                y: xlY,
              },
              4,
              'red',
              `心率：${json[j].xl.value}次`,
              false,
            ),
          ); // 心率
      } else if (ismbwd && mbY === wdY && kw) {
        // 脉搏+口温[红圆+蓝圆]
        const title = `脉搏：${json[j].mb.value}次，口温：${json[j].wd.value}°C`;
        if (mbY && wdY) {
          pointArray.push(drawCircle('mb', { x: j, y: mbY }, 7, 'red', title, false));
          pointArray.push(drawCircle('kw', { x: j, y: mbY }, 3, 'blue', title, true));
        }
        xlY &&
          pointArray.push(
            drawCircle(
              'xl',
              {
                x: j,
                y: xlY,
              },
              4,
              'red',
              `心率：${json[j].xl.value}次`,
              false,
            ),
          ); // 心率
      } else if (ismbxl && mbY === xlY) {
        // 脉搏+心率[红圆]
        const title = `脉搏：${json[j].mb.value}次，心率${json[j].mb.value}次`;
        mbY && xlY && pointArray.push(drawCircle('mb', { x: j, y: mbY }, 4, 'red', title, true));
        drawWd(json[j], j, wdY);
      } else {
        // 正常绘制
        xlY &&
          pointArray.push(
            drawCircle(
              'xl',
              {
                x: j,
                y: xlY,
              },
              4,
              'red',
              `心率：${json[j].xl.value}次`,
              false,
            ),
          ); // 心率
        mbY &&
          pointArray.push(
            drawCircle(
              'mb',
              {
                x: j,
                y: mbY,
              },
              4,
              'red',
              `脉搏：${json[j].mb.value}次`,
              true,
            ),
          ); // 脉搏
        drawWd(json[j], j, wdY);
      }

      // 绘制温度
      function drawWd(point, j, wdY) {
        if (wdY && wdY < wdMax) {
          // 绘制向上的箭头
          pointArray.push(drawArrow({ x: j, y: wdMax }, 2 * height, true, 'blue'));
        } else if (point.wd.type === 'yw') {
          wdY &&
            pointArray.push(
              drawCross(
                'yw',
                {
                  x: j,
                  y: wdY,
                },
                4,
                'blue',
                `腋温：${point.wd.value}°C`,
              ),
            ); // 温度
        } else if (point.wd.type === 'ew') {
          wdY &&
            pointArray.push(
              drawCross(
                'ew',
                {
                  x: j,
                  y: wdY,
                },
                4,
                'blue',
                `耳温：${point.wd.value}°C`,
              ),
            ); // 耳度
        } else if (point.wd.type === 'gw') {
          wdY &&
            pointArray.push(
              drawCircle(
                'gw',
                {
                  x: j,
                  y: wdY,
                },
                4,
                'blue',
                `肛温：${point.wd.value}°C`,
                false,
              ),
            );
        } else if (point.wd.type === 'kw') {
          wdY &&
            pointArray.push(
              drawCircle(
                'yw',
                {
                  x: j,
                  y: wdY,
                },
                4,
                'blue',
                `口温：${point.wd.value}°C`,
                true,
              ),
            );
        }
      }

      // 绘制疼痛
      const title = `疼痛：${json[j].tt.value}`;
      istt && pointArray.push(drawSquare('tt', { x: j, y: ttY }, 4, 'blue', title, true));
    }
  }

  for (let i = 0; i < mbPoints.length; i++) {
    for (let j = 0; j < mbPoints[i].length; j++) {
      const { x } = mbPoints[i][j];
      const { y } = mbPoints[i][j];
      // pointArray.push(drawCircle("mb",{"x":x,"y":y},4,"red","脉搏",true));
    }
    for (let j = 0; j < xlPoints[i].length; j++) {
      const { x } = xlPoints[i][j];
      const { y } = xlPoints[i][j];
      // pointArray.push(drawCircle("xl",{"x":x,"y":y},4,"red","心率",false));
    }
  }
  // 根据心率和脉搏点，绘制多边形（脉搏短促）
  // 统计出现的多边形
  const polygonArray = getPolygon(mbPoints, xlPoints);
  // console.log("多边形")
  // console.log(polygonArray)
  // 绘制多边形
  for (let i = 0; i < polygonArray.length; i++) {
    const polygon = polygonArray[i];
    pointArray.push(drawBlueLine(polygon));
  }
  return pointArray;
}

/**
 * @method getPolygon 获取多边形
 * @param {Array} mbPoints 脉搏点
 * @param {Array} xlPoints 心率点
 * 脉搏短绌即在同一单位时间内，脉率少于心率
 */
function getPolygon(mbPoints, xlPoints) {
  const polygonArray = [];
  const intersectionArray = []; // 缓存交点数组
  for (let i = 0; i < mbPoints.length; i++) {
    intersectionArray[i] = [];
    const mbArray = mbPoints[i];
    const xlArray = xlPoints[i];
    // 如果不存在脉搏大于心率的点则不绘制多边形
    if (mbArray.length === 0 || xlArray.length === 0) {
      return polygonArray;
    }
    for (let j = 0; j < mbArray.length; j++) {
      const curMbX = getParseFloat(mbArray[j].x, 4);
      const curMbY = getParseFloat(mbArray[j].y, 4);
      if (mbArray[j + 1] !== undefined) {
        const nextMbX = getParseFloat(mbArray[j + 1].x, 4);
        const nextMbY = getParseFloat(mbArray[j + 1].y, 4);
        const line1 = lineX({ x: curMbX, y: curMbY }, { x: nextMbX, y: nextMbY });
        for (let h = 0; h < xlArray.length; h++) {
          const curXlX = getParseFloat(xlArray[h].x, 4);
          const curXlY = getParseFloat(xlArray[h].y, 4);
          if (xlArray[h + 1] !== undefined) {
            const nextXlX = getParseFloat(xlArray[h + 1].x, 4);
            const nextXlY = getParseFloat(xlArray[h + 1].y, 4);
            const line2 = lineX({ x: curXlX, y: curXlY }, { x: nextXlX, y: nextXlY });
            const interX = segmentsIntr(line1, line2).x;
            const interY = segmentsIntr(line1, line2).y;
            // 交点在心率线段上
            if (h === xlArray.length - 2 && j === xlArray.length - 2) {
              // console.log(segmentsIntr(line1,line2))
            }
            const xlBool =
              interX >= curXlX &&
              interX <= nextXlX &&
              ((interY >= curXlY && interY <= nextXlY) || (interY <= curXlY && interY >= nextXlY));
            // 交点在脉搏线段上
            const mbBool =
              interX >= curMbX &&
              interX <= nextMbX &&
              ((interY >= curMbY && interY <= nextMbY) || (interY <= curMbY && interY >= nextMbY));
            if (xlBool && mbBool) {
              intersectionArray[i].push(segmentsIntr(line1, line2));
            }
          }
        }
      }
    }
  }
  // 根据交点计算多边形
  for (let i = 0; i < intersectionArray.length; i++) {
    const interArray = intersectionArray[i];
    const xlPoint = xlPoints[i];
    const mbPoint = mbPoints[i];
    if (interArray.length === 0) {
      // 不存在交点
      // 判断是否所有脉搏小于心率的点,按x坐标分组
      const coor = {};
      for (let j = 0; j < xlPoint.length; j++) {
        const { x } = xlPoint[j];
        const { y } = xlPoint[j];
        coor[x] = coor[x] || [];
        coor[x].xl = y;
      }
      for (let j = 0; j < mbPoint.length; j++) {
        const { x } = mbPoint[j];
        const { y } = mbPoint[j];
        coor[x] = coor[x] || [];
        coor[x].mb = y;
      }
      let isMore = true;
      for (const j in coor) {
        if (coor[j].xl && coor[j].mb) {
          if (coor[j].xl > coor[j].mb) {
            isMore = false;
            break;
          }
        }
      }
      if (isMore) {
        // 存在脉搏短促
        const newXlpoint = xlPoint;
        const newMbpoint = mbPoint;
        let newPoint;
        newXlpoint.reverse();
        newPoint = newMbpoint.concat(newXlpoint);
        newPoint.push(newMbpoint[0]);
        polygonArray.push(newPoint);
      }
    }
    // 存在交点，绘制交点前的多边形
    // console.log(intersectionArray)
    if (interArray.length > 0 && mbPoint.length > 0) {
      // 获取第一个交点前脉搏、心率点
      let mbArray = [];
      const xlArray = [];
      const firstInter = interArray[0];
      const firstInterX = interArray[0].x;
      for (let k = 0; k < mbPoint.length; k++) {
        const moreX = mbPoint[k].x;
        if (moreX <= firstInterX) {
          mbArray.push(mbPoint[k]);
        }
      }
      for (let k = 0; k < xlPoint.length; k++) {
        const moreX = xlPoint[k].x;
        if (moreX <= firstInterX) {
          xlArray.push(xlPoint[k]);
        }
      }
      if (mbArray.length > 0 || xlArray.length > 0) {
        mbArray.push(firstInter);
        xlArray.reverse();
        mbArray = mbArray.concat(xlArray);
        mbArray.push(mbArray[0]);
        polygonArray.push(mbArray);
      }
    }
    // 存在多个交点
    for (let f = 0; f < interArray.length; f++) {
      if (interArray[f] && interArray[f + 1] !== undefined) {
        const enterX = interArray[f].x;
        const enterNextX = interArray[f + 1].x;
        let morePointArray = []; // 保存相邻的两个 交点（心率）
        const lessPointArray = []; // 保存相邻的两个 交点（脉搏）
        for (let j = 0; j < mbPoint.length; j++) {
          const moreX = mbPoint[j].x;
          if (moreX >= enterX && moreX <= enterNextX) {
            morePointArray.push(mbPoint[j]);
          }
        }
        for (let j = 0; j < xlPoint.length; j++) {
          const moreX = xlPoint[j].x;
          if (moreX >= enterX && moreX <= enterNextX) {
            lessPointArray.push(xlPoint[j]);
          }
        }
        if (morePointArray.length > 0) {
          // 存在心率大于脉搏的点
          morePointArray.unshift(interArray[f]);
          lessPointArray.reverse();
          morePointArray.push(interArray[f + 1]);
          morePointArray = morePointArray.concat(lessPointArray);
          morePointArray.push(interArray[f]);
          polygonArray.push(morePointArray);
        }
      } else if (interArray[f] && interArray[f + 1] === undefined) {
        // 获取最后的节点
        let morePointArray = []; // 保存相邻的两个 交点（心率）
        const lessPointArray = []; // 保存相邻的两个 交点（脉搏）
        const enterX = interArray[f].x;
        for (let j = 0; j < mbPoint.length; j++) {
          const moreX = mbPoint[j].x;
          if (moreX > enterX) {
            morePointArray.push(mbPoint[j]);
          }
        }
        for (let j = 0; j < xlPoint.length; j++) {
          const moreX = xlPoint[j].x;
          if (moreX > enterX) {
            lessPointArray.push(xlPoint[j]);
          }
        }
        if (morePointArray.length > 0 && lessPointArray.length > 0) {
          // 存在心率大于脉搏的点
          morePointArray.unshift(interArray[f]);
          lessPointArray.reverse();
          morePointArray = morePointArray.concat(lessPointArray);
          morePointArray.push(interArray[f]);
          polygonArray.push(morePointArray);
        }
      }
    }
  }
  return polygonArray || [];
}

/**
 * @method splitGroup 根据请假事件分组
 * @param {Array} leaveEvent 请假事件
 * @param {Array} point 录入信息
 */
function splitGroup(leaveEvent, point) {
  // 没有请假事件
  if (leaveEvent.length === 0) {
    return [point];
  }
  // 按请假事件分组 根据请假事件的数量，判断分组数量
  const groupArray = [];
  const groupRule = []; // 缓存分组规则
  const groupNum = leaveEvent.length + 1; // 分组数量
  for (let i = 0; i < groupNum; i++) {
    // 计算分组规则
    groupRule[i] = {};
    if (i === 0) {
      groupRule[i].min = leaveEvent[i];
    } else if (i === groupNum - 1) {
      groupRule[i].max = leaveEvent[i - 1];
    } else {
      groupRule[i].min = leaveEvent[i - 1];
      groupRule[i].max = leaveEvent[i];
    }
  }
  // 将录入信息根据请假事件分组
  for (let i = 0; i < groupRule.length; i++) {
    const { min } = groupRule[i];
    const { max } = groupRule[i];
    groupArray[i] = []; // 初始化
    for (let j = 0; j < point.length; j++) {
      const time = point[j].dataTime;
      if (judgeIn(time, min, max)) {
        groupArray[i].push(point[j]);
      }
    }
  }
  return groupArray;
}

/**
 * @method judgeIn 判断当前时间是否处于某个时间段
 * @param {String} curTime 当前时间
 * @param {String} minTime 最小时间
 * @param {String} maxTime 最大时间
 * @return {Boolean}
 */
function judgeIn(curTime, minTime, maxTime) {
  curTime = new Date(curTime.replace(/-/g, '/'));
  minTime = minTime ? new Date(minTime.replace(/-/g, '/')) : 0;
  maxTime = maxTime ? new Date(maxTime.replace(/-/g, '/')) : 0;
  if (!minTime && maxTime) {
    // 最小时间未定义，则返回是否大于最大值
    if (curTime > maxTime) {
      return true;
    }
  }
  if (minTime && !maxTime) {
    if (curTime <= minTime) {
      return true;
    }
  }
  if (minTime && maxTime) {
    if (curTime > minTime && curTime <= maxTime) {
      return true;
    }
  }
}

/**
 * @method getXY 计算在svg中的x、y值
 * @param {JSON} point 录入信息
 * @param {String} beginDate 开始时间
 * @param {Number} originY 坐标原点显示刻度
 * @param {Number} maxY 最大刻度
 * @param {Array} ySection y值区间
 * @param {Boolean} type ture 返回phVlaue(物理降温)对应的xy,false value值 返回对应的xy,默认为true
 */
function getXY(point, beginDate, originY, maxY, ySection, type) {
  // let curDate = point.dataTime;
  const curDate = `${point.date} ${point.hour}:00`;
  const value = type ? parseFloat(point.phValue) : parseFloat(point.value);
  const height = 15;
  const daysW = height * 6;
  const Yheight = Math.abs(ySection[0] - ySection[1]);
  // 一刻度是几个像素，y轴
  const Ypxs = Yheight / (maxY - originY); // 原点为(0,0)
  const disTop = parseFloat(ySection[1]);
  // console.log("getXY:"+beginDate)
  const xPx = getDisDays(beginDate, curDate) * daysW;
  const yPx = Math.round(Yheight + disTop - Ypxs * (value - originY));
  return {
    x: xPx,
    y: yPx - 15,
    value,
    type: point.type,
    point,
  };
}

/**
 * @method numToChinese 将阿拉伯数字转换成中文数字
 * @param {Array} numArray 阿拉伯数字数组
 * @param {Array} chineseArray 中文数字数组
 * @return
 * */
function numToChinese(numArray, chineseArray) {
  let finalStr = '';
  if (numArray.length === 1) {
    finalStr = chineseArray[parseInt(numArray[0])];
    return finalStr;
  }
  if (numArray[0] === '1') {
    if (numArray[1] === '0') {
      finalStr += '十';
    } else {
      finalStr += `十${chineseArray[parseInt(numArray[1])]}`;
    }
  } else if (numArray[1] === '0') {
    finalStr += `${chineseArray[parseInt(numArray[0])]}十`;
  } else {
    finalStr += `${chineseArray[parseInt(numArray[0])]}十${chineseArray[parseInt(numArray[1])]}`;
  }

  return finalStr;
}

/**
 * @method getDisDays 计算时间段间隔多少小时
 * @param {String/Date} beginDate 开始时间
 * @param {String/Date} endDate 结束时间
 * @param {Number} beginHour 起始时刻
 * @return
 */
function getDisDays(beginDate, endDate, beginHour) {
  // console.log(beginDate)
  beginHour = beginHour || 2;
  // 判断是否是Date对象
  if (!(beginDate instanceof Date)) {
    console.log('beginDate: ', beginDate);
    beginDate = new Date(beginDate.replace(/-/g, '/'));
  }
  if (!(endDate instanceof Date)) {
    endDate = new Date(endDate.replace(/-/g, '/'));
  }
  return (endDate - beginDate) / (3600 * 1000 * 24);
}

/**
 * @method getParseFloat 将浮点数保留多少位小数
 * @param {String/Float} number 数字
 * @param {String/Float} sub 保留多少位小数
 */
function getParseFloat(number, sub) {
  return parseFloat(parseFloat(number).toFixed(sub));
}

/**
 * 绘制正方形
 * @param {Object} type 属性 可选值有hx/mb/tw
 * @param {Object} size 正方形大小
 * @param {Object} xy 坐标
 * @param {Object} color 颜色
 * @param {Object} title 鼠标放上去显示的值
 * @param {Object} fill 是否实心
 * @return
 */
function drawSquare(type, xy, size, color, title, fill) {
  if (title === null || title === undefined) {
    return '';
  }
  const width = 1; // 定义正方形的宽度
  return (
    <Tooltip className="oak-tooltip" key={`tt${xy.y}${xy.x}`} title={title}>
      <rect
        title={title}
        x={xy.x - size}
        y={xy.y - size}
        width={size * 2}
        height={size * 2}
        style={{ fill: fill ? color : '#fff', stroke: color, strokeWidth: width }}
      />
    </Tooltip>
  );
}

/**
 * @method drawCircle 绘制圆 [ 空心圆,实心圆]
 * @param {String} type 属性 可选值有hx/mb/tw
 * @param {JSON} xy 坐标
 * @param {Number} r 半径
 * @param {String} color 颜色
 * @param {String} title 鼠标放上去显示的值
 * @param {Boolean} fill 是否实心  true为实心，false为空心
 * @return
 */
function drawCircle(type, xy, r, color, title, fill) {
  if (title === null || title === undefined) {
    return '';
  }
  const width = 2; // 定义圆环的宽度
  let circleHtml = '';
  if (fill) {
    // 实心
    circleHtml = (
      <Tooltip className="oak-tooltip" key={type + xy.y + xy.x} title={title}>
        <circle
          cx={xy.x}
          cy={xy.y}
          r={r}
          strokeWidth={width}
          stroke={color}
          fill={color}
          title={title}
        />
      </Tooltip>
    );
  } else {
    // 空心
    circleHtml = (
      <Tooltip className="oak-tooltip" key={type + xy.y + xy.x} title={title}>
        <circle
          key={type + xy.y + xy.x}
          cx={xy.x}
          cy={xy.y}
          r={r}
          strokeWidth={width}
          stroke={color}
          fill="#fff"
          title={title}
        />
      </Tooltip>
    );
  }
  return circleHtml;
}

/**
 * @method drawCross 绘制叉叉
 * @param {String} type 属性 可选值有hx/mb/tw
 * @param {JSON} xy 坐标
 * @param {Number}  halfSize 叉叉的尺寸
 * @param {String} color 颜色
 * @param {String} title 鼠标放上去显示的值
 * @return
 * */
function drawCross(type, xy, halfSize, color, title) {
  const html = [];
  if (title === null || title === undefined) {
    return html;
  }
  const x = parseFloat(xy.x);
  const y = parseFloat(xy.y);
  html.push(
    <Tooltip className="oak-tooltip" key={0} title={title}>
      <line
        type={type}
        cx={x}
        cy={y}
        title={title}
        x1={x - halfSize}
        y1={y + halfSize}
        x2={x + halfSize}
        y2={y + halfSize}
        style={{ strokeWidth: 2, stroke: color }}
      />
    </Tooltip>,
  );
  html.push(
    <Tooltip className="oak-tooltip" key={1} title={title}>
      <line
        type={type}
        title={title}
        x1={x - halfSize}
        y1={y + halfSize}
        x2={x}
        y2={y - 2 * halfSize}
        style={{ strokeWidth: 2, stroke: color }}
      />
    </Tooltip>,
  );
  html.push(
    <Tooltip className="oak-tooltip" key={2} title={title}>
      <line
        type={type}
        title={title}
        x1={x + halfSize}
        y1={y + halfSize}
        x2={x}
        y2={y - 2 * halfSize}
        style={{ strokeWidth: 2, stroke: color }}
      />
    </Tooltip>,
  );
  // return (
  //   <svg key={x}>
  //     {html.map((v, i) => {
  //       return v;
  //     })}
  //   </svg>
  // );
  const x1 = x - 2 * halfSize;
  const y1 = y + 1 * halfSize;
  const x2 = x + 2 * halfSize;
  const y2 = y + 1 * halfSize;
  const x3 = x;
  const y3 = y - 2 * halfSize;
  const pointStr = `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
  return (
    <Tooltip className="oak-tooltip" key={1} title={title}>
      <svg key={x}>
        <polygon key={x} points={pointStr} style={{ fill: color, stroke: color, strokeWidth: 1 }} />
      </svg>
    </Tooltip>
  );
}

/**
 * @method drawFiveStar  绘制五角星
 * @param {String} type 属性 可选值有hx/mb/tw
 * @param {JSON} xy 坐标
 * @param {Number} size 五角星的尺寸
 * @param {String} color 颜色
 * @param {String} title 鼠标放上去显示的值
 * @return
 */
function drawFiveStar(type, xy, size, color, title) {
  if (title === null || title === undefined) {
    return '';
  }
  // 已值点为中心,进行算法来形成五角星
  const disX = size / 2; // 左右差值
  const points = `${xy.x},${xy.y - (size + disX)} ${xy.x - size},${xy.y + (size + disX)}  ${
    xy.x + (size + disX)
  } ,${xy.y - disX} ${xy.x - (size + disX)},${xy.y - disX}, ${xy.x + size},${xy.y + (size + disX)}`;
  return <polygon key={xy.y} type={type} points={points} title={title} fill={color} />;
}

/**
 * @method drawArrow 绘制箭头
 * @param {JSON} xy 坐标 {x:x,y:y}
 * @param {Number} length 箭头长度
 * @param {Boolean} type 箭头类型
 * @param {String} color 箭头颜色
 */
function drawArrow(xy, length, type, color, title) {
  let { x } = xy;
  let y1 = xy.y - length;
  let y2 = xy.y - 3;
  if (type) {
    x = xy.x;
    y1 = xy.y;
    y2 = xy.y - length + 3;
  }
  return (
    <svg key={xy.y + (type ? 'up' : 'down')}>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        style={{ stroke: color, strokeWidth: 1.3 }}
        markerEnd="url(#markerArrow)"
      />
      <defs>
        <marker id="markerArrow" markerWidth="8" markerHeight="8" refX="4" refY="4.5" orient="auto">
          <path
            d="M1.62,1.62 L1.62,7.92 L7.2,4.32 L1.62,1.62"
            style={{ fill: color }}
            title={title || ''}
          />
        </marker>
      </defs>
    </svg>
  );
}

/**
 * @method 绘制文字
 * @param {Object} xy {x:x,y:y} 坐标点
 * @param {Object} color 颜色
 * @param {Object} value 值
 * @param {Object} title 鼠标放上去显示的title
 */
function drawText(xy, color, value, title) {
  const { x } = xy;
  const { y } = xy;
  return (
    <text key={x + y} fill={color} x={x - 6} y={y} title={title}>
      {value}
    </text>
  );
}

/**
 * @method drawPolygon 绘制多边形
 * @param {Array} points 多边形的点[{"x":x,"y":y},{"x":x,"y":y}]
 * @param {String} color 多边形颜色
 * @param {String/Number} key react数组key值（唯一）
 * @return {JSON} polygonLinear 多边形边的二元一次方程的数组；polygonHtml 多边形显示组件；point多边形的点的数组
 */
function drawPolygon(points, color, key) {
  if (points.length === 0) {
    return '';
  }
  color = color || '#000';
  const polygonLinear = [];
  let pointStr;
  const pointStrArray = [];
  const point = [];
  for (let i = 0; i < points.length; i++) {
    pointStr = `${points[i].x},${points[i].y}`;
    // 根据两点求方程
    if (points[i + 1] !== undefined) {
      const linear = lineX(points[i], points[i + 1]);
      polygonLinear.push(linear);
      point.push([points[i], points[i + 1]]);
    }
    pointStrArray.push(pointStr);
  }
  pointStr = pointStrArray.join(' ');
  const polygonHtml = (
    <polygon key={key} points={pointStr} style={{ fill: 'none', stroke: color, strokeWidth: 1 }} />
  );
  return {
    html: polygonHtml,
    linear: polygonLinear,
    point,
  };
}

/**
 * @method lineX 根据两点求二元一次方程
 * @param {JSON} point1 点1{x:"",y:""}
 * @param {JSON} point2 点2{x:"",y:""}
 * @return {JSON} a为常数，b为系数, 返回x为垂直于x轴的直线，返回Y为垂直于y轴的直线
 * */
function lineX(point1, point2) {
  const x1 = point1.x;
  const x2 = point2.x;
  const y1 = point1.y;
  const y2 = point2.y;
  if (x2 - x1 === 0) {
    return { x: x1 };
  }
  /* if(y1 - y2 === 0){
     return {y : y1}
     } */
  // 求系数
  const b = (y2 - y1) / (x2 - x1);
  // 求常数
  const a = y1 - b * x1;
  return {
    a,
    b,
  };
}

/**
 * @method segmentsIntr  求二元一次方程的交点
 * @param {JSON} line1 线条1方程
 * @param {JSON} line2 线条2方程
 * @return 交点
 * */
function segmentsIntr(line1, line2) {
  const a1 = line1.a;
  const a2 = line2.a;
  const b1 = line1.b;
  const b2 = line2.b;
  let x;
  let y;
  if (a2 === undefined || b2 === undefined) {
    x = line2.x;
    y = a1 + b1 * x;
  } else {
    x = (a1 - a2) / (b2 - b1);
    y = a1 + b1 * x;
  }
  x = parseFloat(parseFloat(x).toFixed(4));
  y = parseFloat(parseFloat(y).toFixed(4));
  return {
    x,
    y,
  };
}

/**
 * @method getDoundary 计算边界
 * @param point
 * @returns {{maxX: Number, minX: Number, maxY: Number, minY: Number}}
 */

function getDoundary(point) {
  let maxX = +point[0].x;
  let minX = +point[0].x;
  let maxY = +point[0].y;
  let minY = +point[0].y;
  for (let i = 0; i < point.length; i++) {
    const pointX = +point[i].x;
    const pointY = +point[i].y;
    if (pointX > maxX) {
      maxX = pointX;
    }
    if (pointX < minX) {
      minX = pointX;
    }
    if (pointY > maxY) {
      maxY = pointY;
    }
    if (pointY < minY) {
      minY = pointY;
    }
  }
  return {
    maxX: parseFloat(parseFloat(maxX).toFixed(4)),
    minX: parseFloat(parseFloat(minX).toFixed(4)),
    maxY: parseFloat(parseFloat(maxY).toFixed(4)),
    minY: parseFloat(parseFloat(minY).toFixed(4)),
  };
}

/**
 * @getBlueLineFuncs 获取蓝斜线方法
 * @param {Number/Float} b 斜度
 * @returns {Array}
 */
function getBlueLineFuncs(b) {
  b = b || -4;
  const blueLineFuncs = [];
  // 计算蓝斜线可能显示的最大区域，即根据系数，计算常数的最小值，和最大值
  const svgW = 15 * 42;
  const svgH = 15 * 40;
  const disI = parseInt(b) * 3;
  if (b < 0) {
    const a1 = 0;
    const a2 = svgH - b * svgW;
    for (let i = a1; i < a2; i += 16) {
      //
      blueLineFuncs.push({ a: i, b });
    }
  } else {
    const a1 = -(svgW / b);
    const a2 = svgH;
    for (let i = a1; i < a2; i += 16) {
      blueLineFuncs.push({ a: i, b });
    }
  }
  return blueLineFuncs;
}

/**
 * @method drawBlueLine 绘制蓝斜线
 * @param {Array} polygonArray 多边形点的数组集合
 * @param {String/Number} key react数组的key值
 * @return
 */
function drawBlueLine(polygonArray, key) {
  const htmlArray = [];
  const polygonline = drawPolygon(polygonArray, 'red').linear;
  const htmlde = drawPolygon(polygonArray, 'red', 'polygon').html;
  const { point } = drawPolygon(polygonArray, 'red');
  const totalPoints = [];
  const blueLineFuncs = getBlueLineFuncs();
  for (let i = 0; i < blueLineFuncs.length; i++) {
    const pointArray = [];
    for (let j = 0; j < polygonline.length; j++) {
      const pointNow = point[j];
      const { maxX } = getDoundary(pointNow);
      const { minX } = getDoundary(pointNow);
      const { maxY } = getDoundary(pointNow);
      const { minY } = getDoundary(pointNow);
      // 一条边与斜线的交点
      // 计算交点
      const line1 = blueLineFuncs[i];
      const line2 = polygonline[j];
      const points = segmentsIntr(line1, line2);
      // 判断交点是否在线段上，即在多边形内
      // console.log(minX+"~"+maxX+"~"+minY+"~"+maxY)
      if (points.x >= minX && points.x <= maxX && points.y >= minY && points.y <= maxY) {
        pointArray.push(points);
      }
    }
    if (pointArray.length) {
      totalPoints.push(pointArray);
    }
  }
  for (let j = 0; j < totalPoints.length; j++) {
    const points = totalPoints[j];
    if (points.length === 2) {
      htmlArray.push(
        <line
          key={`${j}points`}
          x1={points[0].x}
          y1={points[0].y}
          x2={points[1].x}
          y2={points[1].y}
          style={{ stroke: 'blue', strokeWidth: 1 }}
        />,
      );
    } else if (points.length > 2 && points.length % 2 === 0) {
      // 根据x值大小排序（升序）冒泡排序
      for (let i = 0; i < points.length - 1; i++) {
        // 取数组中任意两点匹配
        for (let k = 0; k < points.length - 1 - i; k++) {
          const pointX = points[k].x;
          const nextPointX = points[k + 1].x;
          if (pointX > nextPointX) {
            const temp = points[k];
            points[k] = points[k + 1];
            points[k + 1] = temp;
          }
        }
      }
      // 相邻两点生成一条线段
      for (let i = 0; i < points.length; i += 2) {
        htmlArray.push(
          <line
            key={`xiangling${i}`}
            x1={points[i].x}
            y1={points[i].y}
            x2={points[i + 1].x}
            y2={points[i + 1].y}
            style={{ stroke: 'blue', strokeWidth: 1 }}
          />,
        );
      }
    }
  }
  htmlArray.push(htmlde);
  return htmlArray;
}
