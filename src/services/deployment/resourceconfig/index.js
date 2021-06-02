import request from '@/utils/request';

// 系统资源列表
const resourceLists = async (data) => {
  return request.post(`/auth/sysResource/getList`, {
    data,
  });
};

// 新增系统资源
const register = async (data) => {
  return request.post(`/auth/sysResource/register`, {
    data,
  });
};

// 冻结系统资源
const freezeResource = async (data) => {
  return request.post(`/auth/sysResource/changeStatus?id=${data.id}`, {
    data,
  });
};

// 获取系统资源详情
// ps: 后端要求 参数放 url 中
const getResourceInfo = async (data) => {
  return request.post(`/auth/sysResource/getInfo?id=${data.id}`, {
    // data
  });
};

// 删除系统资源
const deleteResource = async (data) => {
  return request.post(`/auth/sysResource/delResource?id=${data.id}`, {
    data,
  });
};

// 编辑系统资源信息
const editResource = async (data) => {
  return request.post(`/auth/sysResource/edit`, {
    data,
  });
};

export { resourceLists, deleteResource, editResource, register, freezeResource, getResourceInfo };
