import request from '@/utils/request';

// 新增字典类别
export async function dictTypeAdd(params) {
  return request('/dictType/add', {
    method: 'POST',
    data: params
  });
};
// 删除字典类别
export async function dictTypeDel(params) {
  return request('/dictType/del', {
    method: 'POST',
    data: params
  });
};
// 查询字典类别
export async function dictTypeSelect(params) {
  return request('/dictType/select', {
    method: 'POST',
    data: params
  });
};
// 修改字典类别
export async function dictTypeUpdate(params) {
  return request('/dictType/update', {
    method: 'POST',
    data: params
  });
};
// ----------
// 新增字典
export async function dictDateAdd(params) {
    return request('/dictDate/add', {
      method: 'POST',
      data: params
    });
  };
  // 删除字典
  export async function dictDateDel(params) {
    return request('/dictDate/del', {
      method: 'POST',
      data: params
    });
  };
  // 查询字典
  export async function dictDateSelect(params) {
    return request('/dictDate/select', {
      method: 'POST',
      data: params
    });
  };
  // 修改字典
  export async function dictDateUpdate(params) {
    return request('/dictDate/update', {
      method: 'POST',
      data: params
    });
  };
