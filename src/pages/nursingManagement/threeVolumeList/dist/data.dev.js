"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columns = void 0;

var columns = function columns(edit) {
  return [{
    title: '住院号',
    dataIndex: 'businessNo',
    key: 'businessNo',
    width: 200,
    fixed: 'left'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    fixed: 'left'
  }, {
    title: '呼吸',
    dataIndex: 'breathing',
    key: 'breathing',
    width: 120
  }, {
    title: '高压',
    dataIndex: 'highBloodPressure',
    key: 'highBloodPressure',
    width: 120
  }, {
    title: '低压',
    dataIndex: 'lowBloodPressure',
    key: 'lowBloodPressure',
    width: 120
  }, {
    title: '入量',
    dataIndex: 'intake',
    key: 'intake',
    width: 120
  }, {
    title: '出量',
    dataIndex: 'output',
    key: 'output',
    width: 120
  }, {
    title: '脉搏',
    dataIndex: 'pulse',
    key: 'pulse',
    width: 120
  }, {
    title: '体温',
    dataIndex: 'temperature',
    key: 'temperature',
    width: 120
  }, {
    title: '尿量',
    dataIndex: 'urine',
    key: 'urine',
    width: 120
  }, {
    title: '体重',
    dataIndex: 'weight',
    key: 'weight',
    width: 120
  }, {
    title: '记录时间',
    dataIndex: 'recordTime',
    key: 'recordTime',
    width: 200
  }, {
    title: '操作',
    render: edit,
    fixed: 'right',
    width: 120
  }];
};

exports.columns = columns;