/**
 * Created by liulingli on 2017/6/22.
 * desc : 体温单 svgLeft 刻度
 */
import React, { Component } from 'react';
import { drawSvgScale } from './tempChart';

export class SvgLeft extends Component {
  render() {
    return (
      <svg id="svgLeft">
        {drawSvgScale({
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
          title: '脉搏',
          // martchs: '140-40,15-40',
        }).scaleArray.map((v, i) => {
          return v;
        })}
        {drawSvgScale({
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
          unit: '℃',
          // martchs: '40-35,15-40',
        }).scaleArray.map((v, i) => {
          return v;
        })}
      </svg>
    );
  }
}
