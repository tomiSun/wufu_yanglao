import request from '@/utils/request';
// import createApi from '@/services/createApi';

// 证书资源列表
export async function getListSystemKey(params) {
  return request('/auth/sysSystemKey/getList', {
    method: 'POST',
    data: params
  });
};
// const systemKeyLists = async (data) => {
//   return request.post(`/auth/sysSystemKey/getList`, {
//     data,
//   });
// };

// 新增证书资源
export async function register(params) {
  return request('/auth/sysSystemKey/register', {
    method: 'POST',
    data: params
  });
};
// const register = async (data) => {
//   return request.post(`/auth/sysSystemKey/register`, {
//     data,
//   });
// };

// 冻结证书资源
export async function freezeSystemKey(params) {
  return request(`/auth/sysSystemKey/changeStatus?id=${params.id}`, {
    method: 'POST',
    // data: params
  });
};
// const freezeSystemKey = async (data) => {
//   return request.post(`/auth/sysSystemKey/changeStatus?id=${data.id}`, {
//     data,
//   });
// };

// 获取证书资源详情
// ps: 后端要求 参数放 url 中
export async function getSystemKeyInfo(params) {
  return request('/auth/sysSystemKey/getInfo', {
    method: 'POST',
    data: params
  });
};
// export const getSystemKeyInfo = createApi('/auth/sysSystemKey/getInfo', 'POST');

// 删除证书资源
export async function deleteSystemKey(params) {
  return request(`/auth/sysSystemKey/delSystemKey?id=${params.id}`, {
    method: 'POST',
    data: params
  });
};
// const deleteSystemKey = async (data) => {
//   return request.post(`/auth/sysSystemKey/delSystemKey?id=${data.id}`, {
//     data,
//   });
// };

// 编辑证书资源信息
export async function editSystemKey(params) {
  return request('/auth/sysSystemKey/edit', {
    method: 'POST',
    data: params
  });
};
// const editSystemKey = async (data) => {
//   return request.post(`/auth/sysSystemKey/edit`, {
//     data,
//   });
// };

// export { systemKeyLists, deleteSystemKey, editSystemKey, register, freezeSystemKey };
export async function upLoad(params) {
  return request('/auth/sysSystemKey/upload', {
    method: 'POST',
    data: params
  });
};
// export const upLoad = createApi('/auth/sysSystemKey/upload', 'POST');
export async function downLoadBook() {
  return request('/auth/sysSystemKey/download');
};
// export const downLoadBook = createApi('/auth/sysSystemKey/download');
export async function getSysList(params) {
  return request('/auth/sysSystem/getList', {
    method: 'POST',
    data: params
  });
};
// export const getSysList = createApi('/auth/sysSystem/getList', 'POST');
export async function getNodeList(params) {
  return request('/auth/sysMainNode/getList', {
    method: 'POST',
    data: params
  });
};
// export const getNodeList = createApi('/auth/sysMainNode/getList', 'POST');
