import request from '@/utils/request';

// 业务科室类型下拉--查询
export async function getDetailByCode(params) {
  return request('/platform/orgBusinessDepartment/getDetailByCode', {
    method: 'POST',
    data: params
  });
};


// 科室人员复合树
export async function departTree(params) {
  return request('/platform/orgDepartment/departTree', {
    method: 'POST',
    data: params
  });
};
// 科室人员复合树详情
export async function treeInfo(params) {
  return request('/platform/orgDepartment/treeInfo', {
    method: 'POST',
    data: params
  });
};
// 行政科室详情查询
export async function orgDepartmentDetail(query) {
  return request(`/platform/orgDepartment/detail?id=${query.id}`);
};
// 新增行政科室
export async function orgDepartmentaAdd(params) {
  return request('/platform/orgDepartment/add', {
    method: 'POST',
    data: params
  });
};
// 更新行政科室
export async function orgDepartmentaUpdate(params) {
  return request('/platform/orgDepartment/update', {
    method: 'POST',
    data: params
  });
};
// 删除行政科室
export async function orgDepartmentaDelete(query) {
  return request(`/platform/orgDepartment/delete?id=${query.id}`);
};
// 行政科室列表查询
export async function orgDepartmentaQuery(params) {
  return request('/platform/orgDepartment/query', {
    method: 'POST',
    data: params
  });
};
// 科室树
export async function orgDepartmentTree(query) {
  return request(`/platform/orgDepartment/tree?orgId=${query.orgId}`);
};


// 下载证书
export async function credentials(params) {
  return request('/platform/sysOrg/getCredentials', {
    method: 'GET',
    params,
  });
};


// 查询--行政科室人员列表模糊分页查询
export async function fuzzyPageQuery(params) {
  return request('/platform/orgDepartmentUser/fuzzyPageQuery', {
    method: 'POST',
    data: params,
  });
};
// 行政科室人员详情查询
export async function orgDepartmentUserDetail(query) {
  return request(`/platform/orgDepartmentUser/detail?id=${query.id}`);
};
// 新增行政科室人员
export async function orgDepartmentUserAdd(params) {
  return request('/platform/orgDepartmentUser/add', {
    method: 'POST',
    data: params
  });
};
// 更新行政科室人员
export async function orgDepartmentUserUpdate(params) {
  return request('/platform/orgDepartmentUser/update', {
    method: 'POST',
    data: params
  });
};
// 删除行政科室人员
export async function orgDepartmentUserDelete(query) {
  return request(`/platform/orgDepartmentUser/delete?id=${query.id}`)
};
// 行政科室人员列表查询
export async function orgDepartmentUserQuery(params) {
  return request('/platform/orgDepartmentUser/query', {
    method: 'POST',
    data: params
  });
};
// 行政科室人员引用
export async function userReference(params) {
  return request('/platform/orgDepartmentUser/userReference', {
    method: 'POST',
    data: params
  });
};


// 根据人员查询业务科室选择情况（组合）
export async function chooseDepartmentTree(params) {
  return request('/platform/orgBusinessDepartmentRight/chooseDepartmentTree', {
    method: 'POST',
    data: params
  });
};
// 基于人员新增行政科室权限
export async function addOrgBusinessDepartmentRightBySysUser(params) {
  return request('/platform/orgBusinessDepartmentRight/addOrgBusinessDepartmentRightBySysUser', {
    method: 'POST',
    data: params
  });
};







