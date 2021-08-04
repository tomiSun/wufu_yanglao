import request from '@/utils/request';

// 新增
export async function recordAdd(params) {
  return request('/comprehensive/donation', {
    method: 'POST',
    data: params,
  });
}
// 删除
export async function recordDel(params) {
  return request('/comprehensive/delDonation', {
    method: 'GET',
    params,
  });
}
// 查询
export async function recordSelect(params) {
  return request('/comprehensive/pageDonation', {
    method: 'POST',
    data: params,
  });
}
// 修改
export async function recordUpdate(params) {
  return request('/comprehensive/updateDonation', {
    method: 'POST',
    data: params,
  });
}
