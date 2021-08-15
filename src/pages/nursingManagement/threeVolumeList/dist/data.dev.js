"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columns = void 0;

var columns = function columns(edit) {
  return [{
    title: '住院编号',
    dataIndex: 'businessNo',
    key: 'businessNo'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '呼吸',
    dataIndex: 'breathing',
    key: 'breathing'
  }, {
    title: '高压',
    dataIndex: 'highBloodPressure',
    key: 'highBloodPressure'
  }, {
    title: '低压',
    dataIndex: 'lowBloodPressure',
    key: 'lowBloodPressure'
  }, {
    title: '入量',
    dataIndex: 'intake',
    key: 'intake'
  }, {
    title: '出量',
    dataIndex: 'output',
    key: 'output'
  }, {
    title: '脉搏',
    dataIndex: 'pulse',
    key: 'pulse'
  }, {
    title: '出量',
    dataIndex: 'output',
    key: 'output'
  }, {
    title: '记录时间',
    dataIndex: 'recordTime',
    key: 'recordTime'
  }, {
    title: '体温',
    dataIndex: 'temperature',
    key: 'temperature'
  }, {
    title: '尿量',
    dataIndex: 'urine',
    key: 'urine'
  }, {
    title: '体重',
    dataIndex: 'weight',
    key: 'weight'
  }, {
    title: '操作',
    render: edit
  }];
};

exports.columns = columns;