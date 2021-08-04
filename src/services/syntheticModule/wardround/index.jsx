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
export async function wardroundSelect(params) {
  return request('/administrative/query', {
    method: 'GET',
    params,
  });
}
// 修改
export async function wardroundUpdate(params) {
  return request('/administrative/update', {
    method: 'POST',
    data: params,
  });
}
