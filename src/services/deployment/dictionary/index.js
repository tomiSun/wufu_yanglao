import request from '@/utils/request';

// // 获取字典类型下拉框数据
export async function queryCateList(query) {
  return request('/dict/dictPub/queryCateList');
};

// 医保信用专用分类
export async function healthCareCategory(params) {
  return request('/dict/dictPub/healthCareCategory', {
    method: 'GET',
    params
  });
};

// 获取类型下的分类列表
export async function queryTypeList(query) {
  return request(`/dict/dictPub/queryTypeList?categoryId=${query.categoryId}&typeName=${query.typeName}`);
};

// 获取类型下的分类明细
export async function queryTypeDetails(query) {
  return request(`/dict/dictPub/queryTypeDetails?id=${query.id}`);
};
// 编辑类型下的分类
export async function updateType(params) {
  return request('/dict/dictPub/updateType', {
    method: 'POST',
    data: params
  });
};
// 新增类型下的分类
export async function insertType(params) {
  return request('/dict/dictPub/insertType', {
    method: 'POST',
    data: params
  });
};
// 删除类型下的分类
export async function deleteType(params) {
  return request('/dict/dictPub/deleteType', {
    method: 'POST',
    data: params
  });
};


// 获取分类明细table数据
export async function queryTypeDetailsList(query) {
  return request(`/dict/dictPub/queryTypeDetailsList?orgId=${query.orgId}&typeId=${query.typeId}&isOrgUse=${query.isOrgUse}&pageNum=${query.pageNum}&pageSize=${query.pageSize}`);
};
// 维护界面-根据id查询字典详情
export async function querySingleDictDetails(query) {
  return request(`/dict/dictPub/querySingleDictDetails?dictId=${query.dictId}`);
};
// 维护界面-修改字典
export async function updateTypeDetail(params) {
  return request('/dict/dictPub/updateTypeDetail', {
    method: 'POST',
    data: params
  });
};
// 维护界面-新增字典
export async function insertTypeDetail(params) {
  return request('/dict/dictPub/insertTypeDetail', {
    method: 'POST',
    data: params
  });
};
// // 维护界面-删除字典
// export async function deleteDict(params) {
//   return request(`/dict/dictPub/deleteDict?id=${params.id}`, {
//     method: 'POST',
//   });
// };

