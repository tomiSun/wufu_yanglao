/**
 * Created by liulingli on 2017/6/22.
 * desc : 体温单 svgCenter 绘制折线
 */
import React, { Component } from 'react';
import { drawEvent, drawHzhx, parseRePoint } from './tempChart';

export class SvgCenter extends Component {
  componentWillMount() {
    this.state = {
      curDate: this.props.curDate,
      data: this.props.data,
    };
  }

  // componentWillReceiveProps(nextProps, nextState) {
  //   if (nextProps.curDate !== nextState.curDate || nextProps.data !== nextState.data) {
  //     this.setState({
  //       curDate: nextProps.curDate,
  //       data: nextProps.data,
  //     });
  //   }
  // }

  render() {
    let { curDate, data } = this.state;
    return (
      <svg id="svgCenter" style={{ height: 15 * 40 }}>
        {/* 绘制特殊事假（文字） */}
        {/* {data.eventDatas &&
          curDate &&
          drawEvent(data.eventDatas, curDate).map((v, i) => {
            return v;
          })} */}
        {/* 绘制呼吸 */}
        {/* {data.hzfx &&
          curDate &&
          drawHzhx(data.hzfx, curDate).map((v, i) => {
            return v;
          })} */}
        {curDate &&
          parseRePoint(data, curDate).map((v, i) => {
            return v;
          })}
      </svg>
    );
  }
}