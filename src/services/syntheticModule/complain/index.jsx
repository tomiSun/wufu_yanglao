import request from '@/utils/request';

// 新增
export async function complainAdd(params) {
  return request('/comprehensive/addComplaint', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function complainDel(params) {
  return request('/comprehensive/delComplaint', {
    method: 'GET',
    params,
  });
}
// 查询
export async function complainSelect(params) {
  return request('/comprehensive/pageComplaint', {
    method: 'POST',
    data: params,
  });
}
// 修改
export async function complainUpdate(params) {
  return request('/comprehensive/updateComplaint', {
    method: 'POST',
    data: params,
  });
}
