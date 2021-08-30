/**
 * Created by liulingli on 2017/7/5.
 * desc : 体温单 生成参考表格、左右侧刻度
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { parseMapData } from './tempChart';
import { SvgLeft } from './svgLeft';
import { SvgRight } from './svgRight';

export class GridTable extends Component {
  componentWillMount() {
    this.state = {
      breathingList: this.props.breathingList,
      dayMap: this.props.dayMap,
      xyList: this.props.xyList,
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (
      nextProps.breathingList !== nextState.breathingList ||
      nextProps.dayMap !== nextState.dayMap
    ) {
      this.setState({
        breathingList: nextProps.breathingList,
        dayMap: nextProps.dayMap,
        xyList: nextProps.xyList,
      });
    }
  }

  createTable = (breathingList, xyList, dayMap) => {
    let gridArray = [];
    for (let i = 0; i < 41; i++) {
      gridArray[i] = [];
      if (i === 0) {
        gridArray[i].push(
          <td key={0} rowSpan={41}>
            <div className="svgLeft">
              <SvgLeft />
            </div>
          </td>,
        );
        for (let j = 0; j < 42; j++) {
          if ((j + 1) % 6 === 0) {
            gridArray[i].push(<td key={j + 1} className="borderR" />);
          } else {
            gridArray[i].push(<td key={j + 1} />);
          }
        }
        // gridArray[i].push(
        //   <td key={43} rowSpan={45}>
        //     <div className="svgRight">
        //       <SvgRight />
        //     </div>
        //   </td>,
        // );
      } else {
        for (let j = 0; j < 42; j++) {
          if ((j + 1) % 6 === 0) {
            gridArray[i].push(<td key={j + 1} className="borderR"></td>);
          } else {
            gridArray[i].push(<td key={j + 1} />);
          }
        }
      }
    }
    //生成呼吸信息
    let hxData = breathingList; //获取呼吸数据
    let len = gridArray.length;
    gridArray[len] = [];
    gridArray[len].push(
      <td key={0} className="hx">
        呼吸
      </td>,
    );
    for (let i = 0; i < 42; i++) {
      let align = i % 2 === 0 ? 'top' : 'bottom';
      if ((i + 1) % 6 === 0) {
        gridArray[len].push(
          <td style={{ verticalAlign: align }} key={i + 1} className="borderR hx">
            {hxData[i]}
          </td>,
        );
      } else {
        gridArray[len].push(
          <td style={{ verticalAlign: align }} key={i + 1} className="hx">
            {hxData[i]}
          </td>,
        );
      }
    }
    // gridArray[len].push(<td key={43} className="hx" />);

    //生成血压信息
    let xyData = xyList; //获取血压数据
    console.log('xyData: ', xyData);
    gridArray[len + 1] = [];
    gridArray[len + 1].push(
      <td key={0} className="hx">
        血压（mmHg）
      </td>,
    );
    for (let i = 0; i < 14; i++) {
      if ((i + 1) % 2 === 0) {
        gridArray[len + 1].push(
          <td key={i + 1} className="borderR hx" colSpan={3}>
            {xyData[i]}
          </td>,
        );
      } else {
        gridArray[len + 1].push(
          <td key={i + 1} className="hx" colSpan={3}>
            {xyData[i]}
          </td>,
        );
      }
    }
    //生成每日录入信息
    let dayInput = parseMapData(dayMap); //获取每日录入数据
    let title = dayInput.titleArray;
    let value = dayInput.valueArray;
    for (let i = 0; i < title.length; i++) {
      let length = gridArray.length;
      gridArray[length] = [];
      gridArray[length].push(
        <td key={0} className="every">
          {title[i].name + '(' + title[i].units + ')'}
        </td>,
      );
      for (let j = 0; j < value[i].length; j++) {
        gridArray[length].push(
          <td key={1 + j} colSpan={6} className="every borderR">
            {value[i][j]}
          </td>,
        );
      }
      // gridArray[length].push(<td key={value[i].length + 1} className="every" />);
    }
    return gridArray;
  };

  render() {
    let { breathingList, dayMap, xyList } = this.state;
    let gridArray = this.createTable(breathingList, xyList, dayMap);
    return (
      <tbody>
        {gridArray.map((tr, i) => {
          return (
            <tr
              className={classNames('height', (i + 1) % 5 === 0 && i < 41 ? 'borderB' : '')}
              key={i}
            >
              {tr.map((td, j) => {
                return td;
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }
}
