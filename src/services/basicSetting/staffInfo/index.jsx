import request from '@/utils/request';

// 新增员工
export async function employeeAdd(params) {
  return request('/employee/add', {
    method: 'POST',
    data: params,
  });
}
// 删除护工信息
export async function employeeDel(params) {
  return request('/employee/del', {
    method: 'GET',
    params,
  });
}
// 查询员工信息
export async function employeeSelect(params) {
  return request('/employee/select', {
    method: 'POST',
    data: params,
  });
}
// 重置密码
export async function employeeesetPassword(params) {
  return request('/employee/resetPassword', {
    method: 'GET',
    params,
  });
}
// ----------
// 修改员工信息
export async function employeeUpdate(params) {
  return request('/employee/update', {
    method: 'POST',
    data: params,
  });
}
