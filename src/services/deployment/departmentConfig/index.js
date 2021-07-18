import request from '@/utils/request';


// // 查询--机构科室明细
// export async function orgDepartmentDetail(query) {
//   return request(`/organization/orgDepartment/detail?id=${query.id}&level=${query.level}`);
// };
//
// // 修改--机构科室记录
// export async function orgDepartmentUpdate(params) {
//   return request('/organization/orgDepartment/update', {
//     method: 'POST',
//     data: params
//   });
// };

// 修改--机构科室记录
export async function queryParameterDepartmentMember(query) {
  return request(`x/orgParameterConfig/queryParameterDepartmentMember?name=${query.name}`);
};
