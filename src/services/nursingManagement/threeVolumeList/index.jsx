import request from '@/utils/request';

// 新增
export async function wardroundAdd(params) {
  return request('/administrative/insert', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function wardroundDel(params) {
  return request('/administrative/delete', {
    method: 'GET',
    params,
  });
}
// 查询
// 批量插入——查询当前时间点三测单列表
export async function batchQueryVitalSignRecord(params) {
  return request('/nursingManage/batchQueryVitalSignRecord', {
    method: 'POST',
    data: params,
  });
}
// 批量更新三测单
export async function batchUpdateVitalSignRecord(params) {
  return request('/nursingManage/batchUpdateVitalSignRecord', {
    method: 'POST',
    data: params,
  });
}
// 单独更新三测单
export async function addVitalSignRecord(params) {
  return request('/nursingManage/addVitalSignRecord', {
    method: 'POST',
    data: params,
  });
}
// 修改
export async function wardroundUpdate(params) {
  return request('/administrative/update', {
    method: 'POST',
    data: params,
  });
}
