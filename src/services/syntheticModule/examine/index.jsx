import request from '@/utils/request';

// 新增
export async function examineAdd(params) {
  return request('/comprehensive/addCheck', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function examineDel(params) {
  return request('/comprehensive/delCheck', {
    method: 'GET',
    params,
  });
}
// 根据姓名模糊查询护工信息
export async function selectByName(params) {
  return request('/care/selectByName', {
    method: 'GET',
    params,
  });
}
// 查询
export async function examineSelect(params) {
  return request('/comprehensive/pageCheck', {
    method: 'POST',
    data: params,
  });
}
// 修改
export async function examineUpdate(params) {
  return request('/comprehensive/updateCheck', {
    method: 'POST',
    data: params,
  });
}
