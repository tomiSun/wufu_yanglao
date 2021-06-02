import request from '@/utils/request';

// 根据roleCategoryCode查询--科室人员管理->人员权限维护，角色列表查询
export async function getUserRoleByCodeAndOrgUserId(query) {
  return request(`/platform/sysRole/getUserRoleByCodeAndOrgUserId?orgUserId=${query.orgUserId}&roleCategoryCode=${query.roleCategoryCode}`);
};
// 查询人员拥有的全部角色（按角色分类返回） =>用于科室人员管理=>角色分配
export async function getUserRoleList(query) {
  return request(`/platform/sysRole/getUserRoleList?orgUserId=${query.orgUserId}`);
};
// 保存--角色分配xx,基于科室人员批量分配角色(为人员分配多个角色)
export async function saveUserRole(params) {
  return request('/platform/roleAssignments/saveUserRole', {
    method: 'POST',
    data: params
  });
};


// 查询人员权限维护 =>用于科室人员管理=>权限
export async function getUserResourceConfigData(params) {
  return request('/platform/sysUserResource/getUserResourceConfigData', {
    method: 'POST',
    data: params
  });
};


// 根据orgId查询已分配系统资源
export async function queryResourceByOrgId(params) {
  return request('/platform/sysOrgResource/queryResourceByOrgId', {
    method: 'POST',
    data: params
  });
};
// 查询--用户菜单 明细数据
export async function sysUserResourceDetail(query) {
  return request(`/platform/sysUserResource/detail?id=${query.id}`);
};
// 新增--用户菜单记录, 新增科室人员角色自定义资源菜单
export async function sysUserResourceAdd(params) {
  return request('/platform/sysUserResource/add', {
    method: 'POST',
    data: params
  });
};
// 修改--用户菜单记录,修改科室人员角色自定义资源菜单
export async function sysUserResourceUpdate(params) {
  return request('/platform/sysUserResource/update', {
    method: 'POST',
    data: params
  });
};
// 单次删除--用户菜单记录, 删除科室人员角色自定义资源菜单
export async function sysUserResourceDelete(query) {
  return request(`/platform/sysUserResource/delete?id=${query.id}`);
};
// 配置人员权限维护
export async function setUserResourceConfig(params) {
  return request('/platform/sysUserResource/setUserResourceConfig', {
    method: 'POST',
    data: params
  });
};
