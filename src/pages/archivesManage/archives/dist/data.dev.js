"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columns = void 0;

var _antd = require("antd");

var columns = function columns(edit, dictionaryMap) {
  return [{
    title: '档案编号',
    dataIndex: 'id',
    key: ' id',
    width: 200,
    fixed: 'left'
  }, {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    width: 50,
    render: function render(t, r) {
      return t == "1" ? "男" : "女";
    }
  }, {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
    width: 200
  }, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 50
  }, {
    title: '联系电话',
    dataIndex: 'contactNumber',
    key: 'contactNumber',
    width: 120
  }, {
    title: '联系人姓名',
    dataIndex: 'guardianName',
    key: 'guardianName',
    width: 120
  }, {
    title: '联系人身份证号',
    dataIndex: 'guardianIdCard',
    key: 'guardianIdCard',
    width: 120
  }, {
    title: '关系',
    dataIndex: 'relation',
    key: 'relation',
    width: 120 // render: (t, r) => {
    //     let data = dictionaryMap["0010"]
    //     let res = data.find(item => {
    //         return item.dictCode == t
    //     })
    //     return !!res ? res['dictName'] : t
    // }

  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200
  }, {
    title: '联系地址',
    dataIndex: 'contactAddress',
    key: 'contactAddress'
  }, {
    width: 100,
    fixed: 'right',
    title: '操作',
    render: edit
  }];
};

exports.columns = columns;