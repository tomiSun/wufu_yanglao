import request from '@/utils/request';

// 查询满意度测评
export async function queryPageBed(params) {
  return request('/page/bed/query', {
    method: 'GET',
    params,
  });
}
// 满意度测评
export async function queryPage(params) {
  return request('/page/query', {
    method: 'GET',
    params,
  });
}
