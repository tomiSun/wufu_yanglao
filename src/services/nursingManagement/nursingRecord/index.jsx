import request from '@/utils/request';
// 批量插入——查询当前时间点护理记录列表
export async function batchQueryNursingRecord(params) {
  return request('/nursingManage/batchQueryNursingRecord', {
    method: 'POST',
    data: params,
  });
}
// 批量更新护理记录
export async function batchUpdateNursingRecord(params) {
  return request('/nursingManage/batchUpdateNursingRecord', {
    method: 'POST',
    data: params,
  });
}
// 单独新增护理记录
export async function addNursingRecord(params) {
  return request('/nursingManage/addNursingRecord', {
    method: 'POST',
    data: params,
  });
}
// 删除护理记录
export async function delNursingRecord(params) {
  return request('/nursingManage/delNursingRecord', {
    method: 'GET',
    params,
  });
}
