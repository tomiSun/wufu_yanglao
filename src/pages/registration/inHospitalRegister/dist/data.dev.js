"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.columns = void 0;

var _common = require("@/utils/common.js");

var columns = function columns(edit, dictionaryMap) {
  return [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    fixed: 'left'
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    width: 50,
    fixed: 'left',
    render: function render(t, r) {
      if (!t) {
        return "-";
      }

      return String(t) === "1" ? "男" : "女";
    }
  }, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
    width: 80
  }, {
    title: '床位号',
    dataIndex: 'bedName',
    key: 'bedName',
    fixed: 'left',
    width: 120,
    render: function render(t, r) {
      var res = "".concat(r['buildingName'] || "#", "-").concat(r['floorName'] || "#", "-").concat(r['roomName'] || "#", "-").concat(r['bedName'] || "#");
      return res;
    }
  }, {
    title: '房间类型',
    dataIndex: 'roomTYpe',
    key: 'roomTYpe',
    fixed: 'left',
    width: 120,
    render: function render(t, r) {
      console.log("dictionaryMap", dictionaryMap);
      var text = t || "0001";
      return (0, _common.getDictNameByCode)(dictionaryMap, "0003", text);
    }
  }, {
    title: '护理级别',
    dataIndex: 'nursingLevel',
    key: 'nursingLevel',
    width: 100,
    render: function render(t, r) {
      return (0, _common.getDictNameByCode)(dictionaryMap, "0011", t);
    }
  }, {
    title: '入院诊断',
    dataIndex: 'hospitalDiagnosis',
    key: 'hospitalDiagnosis',
    width: 200 // render: (t, r) => {
    //     let res = ""
    //     t.forEach((element, index) => {
    //         res = res + `${index == 0 ? "" : "、"}` + getDictNameByCode(dictionaryMap, "0015", element)
    //     });
    //     return res
    // }

  }, {
    title: '入院时间',
    dataIndex: 'admissionTime',
    key: 'admissionTime',
    width: 200
  }, {
    title: '费用到期时间',
    dataIndex: 'feesDueDate',
    key: 'feesDueDate',
    width: 200
  }, {
    title: '费用到期标志',
    dataIndex: 'feesDueStatue',
    key: 'feesDueStatue',
    width: 120,
    render: function render(t, r) {
      if (t == null) {
        return "-";
      }

      return t == "0" ? "正常" : "欠费";
    }
  }, {
    title: '过敏史',
    dataIndex: 'allergy',
    key: 'allergy',
    width: 200 // render: (t, r) => {
    //     let res = ""
    //     t.forEach((element, index) => {
    //         res = res + `${index == 0 ? "" : "、"}` + getDictNameByCode(dictionaryMap, "0008", element)
    //     });
    //     return res
    // }

  }, {
    title: '既往史',
    dataIndex: 'previousHistory',
    key: 'previousHistory',
    width: 200 // render: (t, r) => {
    //     let res = ""
    //     t.forEach((element, index) => {
    //         res = res + `${index == 0 ? "" : "、"}` + getDictNameByCode(dictionaryMap, "0009", element)
    //     });
    //     return res
    // }

  }, {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
    width: 200
  }, {
    title: '联系人姓名',
    dataIndex: 'relationName',
    key: 'relationName',
    width: 100
  }, {
    title: '关系',
    dataIndex: 'relation',
    key: 'relation',
    width: 100 // render: (t, r) => {
    //    let res =getDictNameByCode(dictionaryMap, "0010", t)
    //     return res
    // }

  }, {
    title: '联系电话',
    dataIndex: 'contactNumber',
    key: 'contactNumber',
    width: 120
  }, {
    title: '家庭住址',
    dataIndex: 'contactAddress',
    key: 'contactAddress',
    width: 220
  }, {
    title: '操作',
    render: edit,
    width: 600,
    fixed: 'right'
  }];
};

exports.columns = columns;