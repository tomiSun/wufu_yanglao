import request from '@/utils/request';
export async function shiftchangeAdd(params) {
  return request('/change-shift/insert', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function shiftchangeDel(params) {
  return request('/change-shift/delete', {
    method: 'GET',
    params,
  });
}
// 查询
export async function shiftchangeSelect(params) {
  return request('/change-shift/query', {
    method: 'GET',
    params,
  });
}
// 修改
export async function shiftchangeUpdate(params) {
  return request('/change-shift/update', {
    method: 'POST',
    data: params,
  });
}
