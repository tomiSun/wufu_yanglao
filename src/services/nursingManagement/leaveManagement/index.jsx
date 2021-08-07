import request from '@/utils/request';

// 新增
export async function leaveManagementAdd(params) {
  return request('/leave-application/insert', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function leaveManagementDel(params) {
  return request('/leave-application/delete', {
    method: 'GET',
    params,
  });
}
// 查询
export async function leaveManagementSelect(params) {
  return request('/leave-application/query', {
    method: 'GET',
    params,
  });
}
// 修改
export async function leaveManagementUpdate(params) {
  return request('/leave-application/update', {
    method: 'POST',
    data: params,
  });
}
