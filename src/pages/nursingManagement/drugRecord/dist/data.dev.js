"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columns = void 0;

var _common = require("@/utils/common.js");

var columns = function columns(edit, dictionaryMap) {
  return [{
    title: '住院号',
    dataIndex: 'businessNo',
    key: 'businessNo'
  }, // {
  //     title: '床号',
  //     dataIndex: 'bedCode',
  //     key: 'bedCode',
  // },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  }, {
    title: '药品规格',
    dataIndex: 'drugSpecification',
    key: 'drugSpecification'
  }, {
    title: '剂量',
    dataIndex: 'measure',
    key: 'measure'
  }, {
    title: '频次',
    dataIndex: 'frequency',
    key: 'frequency'
  }, {
    title: '用药日期',
    dataIndex: 'medicationDate',
    key: 'medicationDate'
  }, {
    title: '用药时间',
    dataIndex: 'medicationTime',
    key: 'medicationTime',
    render: function render(t, r) {
      return (0, _common.getDictNameByCode)(dictionaryMap, "0006", t);
    }
  }, {
    title: '操作',
    render: edit
  }];
};

exports.columns = columns;