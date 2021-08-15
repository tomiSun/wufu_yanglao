import request from '@/utils/request';

// 查询满意度测评
export async function satisficingSelect(params) {
  return request('/comprehensive/selectMeasurement', {
    method: 'GET',
    params,
  });
}
// 满意度测评
export async function satisficingUpdate(params) {
  return request('/comprehensive/add', {
    method: 'POST',
    data: params,
  });
}
