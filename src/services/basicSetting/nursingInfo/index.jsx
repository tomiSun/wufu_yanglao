import request from '@/utils/request';
// 新增字典
export async function careAdd(params) {
  return request('/care/add', {
    method: 'POST',
    data: params,
  });
}
// 删除字典
export async function careDel(params) {
  return request('/care/del', {
    method: 'POST',
    data: params,
  });
}
// 查询字典
export async function careSelect(params) {
  return request('/care/select', {
    method: 'POST',
    data: params,
  });
}
// 修改字典
export async function careUpdate(params) {
  return request('/care/update', {
    method: 'POST',
    data: params,
  });
}
