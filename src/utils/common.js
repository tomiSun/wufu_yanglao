import { message } from 'antd';
/**
 * 查询数据源中val对应的参数值
 * @param {object} data 数据源
 * @param {*} key 参数名称
 * @param {*} val 搜寻的参数值
 * @param {*} returnKey 返回的参数名称
 */
export const findValByKey = (data, key, val, returnKey) => {
  if (data?.length) {
    let res = data.find((it) => {
      return it[key] === val;
    });
    return res ? res[returnKey] : null;
  } else {
    return '';
  }
};
// 设置sessionStorage
export const setSes = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  window.sessionStorage.setItem(key, value);
};
// 获取sessionStorage
export const getSes = (key) => {
  let value = window.sessionStorage.getItem(key);
  if (value) {
    value = JSON.parse(value);
    return value;
  }
};
// 删除返回上一页
export const delGotoPrev = (that) => {
  message.success('删除成功');
  let { lists } = that.state;
  let { pageNum } = that.props.state;
  if (lists.length === 1 && pageNum > 1) {
    pageNum = pageNum - 1;
  }
  that.props.hocThis.setState({ pageNum, currentRow: {} }, () => {
    that.getLists();
  });
};
/**
 * 数字前补0
 * num:数字
 * length:位数
 */
export const paddingZero = (num, length) => {
  return (Array(length).join('0') + num).slice(-length);
};
/**
 * 选项添加全部选项
 * num:数字
 * length:位数
 */
export const optionAddAll = (list) => {
  let res = [...list];
  res.unshift({ label: '全部', value: '', key: '', code: '', name: '全部' });
  return res;
};
export const getDefaultOption = (list) => {
  let res;
  if (list?.length) {
    list.map((it) => {
      if (it.defaultFlag == 1 && it.useFlag != '0') {
        res = it;
      }
    });
  }
  return res || list?.[0];
};
export const convertOption = (list = []) => {
  if (list?.length) {
    list.map((it) => {
      it['label'] = it.name;
      it['value'] = it.code;
    });
  }
  return list;
};
// reducer
export const reducer = (state, payload) => {
  // switch (type) {
  //   case 'updateState':
  //     return { ...state, ...payload };
  //   default:
  //     return state;
  // }
  return { ...state, ...payload, randomKey: Math.random() };
};
//设置layout
export const ULayout = (x, y, labelAlign, layout) => {
  return {
    labelCol: { span: x },
    wrapperCol: { span: y },
    labelAlign,
    layout,
  };
};
//根据dictCode 获取dictName
export const getDictNameByCode = (dict, key, code) => {
  let item = dict[key].find((item) => {
    if (item.dictCode == code) return item;
  });
  return !!item ? item['dictName'] : '-';
};
export const analyzeIDCard = (idcard) => {
  const sexAndAge = {};
  //获取用户身份证号码
  const userCard = idcard;
  //如果用户身份证号码为undefined则返回空
  if (!userCard || userCard?.length != 18) {
    return sexAndAge;
  }

  // 获取性别
  if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
    // 男
    sexAndAge.sex = '1';
  } else {
    // 女
    sexAndAge.sex = '2';
  }
  // 获取出生日期
  const yearBirth = userCard.substring(6, 10);
  const monthBirth = userCard.substring(10, 12);
  const dayBirth = userCard.substring(12, 14);
  sexAndAge.birthDay = `${yearBirth}-${monthBirth}-${dayBirth}`;
  // 获取当前年月日并计算年龄
  const myDate = new Date();
  const monthNow = myDate.getMonth() + 1;
  const dayNow = myDate.getDate();
  const age = myDate.getFullYear() - yearBirth;
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    age--;
  }
  // 得到年龄
  sexAndAge.age = age;
  // 返回 性别和年龄
  return sexAndAge;
};
