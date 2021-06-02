import request from '@/utils/request';

// 列表 登录日志查询
export async function getLoginLogQueryList(params) {
  return request('/platform/esLog/esLoginLog', {
    method: 'POST',
    data: params
  });
};

// 列表 操作日志查询
export async function getCheckLogList(params) {
  return request('/platform/esLog/esOperationLog', {
    method: 'POST',
    data: params
  });
}

// 查询所有子机构树形
export async function getTreeData(params) {
  return request('/platform/sysOrg/getAllSysOrgTreeByParent', {
    method: 'GET',
    params
  });
}