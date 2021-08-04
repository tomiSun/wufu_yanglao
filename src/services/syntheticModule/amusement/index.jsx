import request from '@/utils/request';

// 新增
export async function amusementAdd(params) {
  return request('/comprehensive/addInterestGroup', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function amusementDel(params) {
  return request('/comprehensive/delInterestGroup', {
    method: 'GET',
    params,
  });
}
// 查询
export async function amusementSelect(params) {
  return request('/comprehensive/pageInterestGroup', {
    method: 'POST',
    data: params,
  });
}
// 修改
export async function amusementUpdate(params) {
  return request('/comprehensive/updateInterestGroup', {
    method: 'POST',
    data: params,
  });
}
