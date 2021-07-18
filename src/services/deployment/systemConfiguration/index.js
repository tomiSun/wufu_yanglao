import request from '@/utils/request';

// 查询--参数配置表分页数据
export async function orgParameterConfigPage(params) {
  return request('x/orgParameterConfig/page', {
    method: 'POST',
    data: params
  });
};
// 查询系统应用接口
export async function orgParameterConfigDetail(query) {
  return request(`x/orgParameterConfig/detail?id=${query.id}`);
};
// 修改系统参数配置应用接口
export async function orgParameterConfigUpdate(params) {
  return request('x/orgParameterConfig/update', {
    method: 'POST',
    data: params
  });
};


