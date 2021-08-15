import request from '@/utils/request';

// 批量更新菜谱
export async function cookbookUpdate(params) {
  return request('/menu/batchUpdate', {
    method: 'POST',
    data: params,
  });
}

// 查询
export async function cookbookSelect(params) {
  return request('/menu/select', {
    method: 'GET',
    params,
  });
}
