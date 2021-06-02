import request from '@/utils/request';

// 用户列表
const getRoleLists = async (data) => {
  return request.post(`/platform/roleResource/treeNode`, {
    data,
  });
};
// 获取角色人员列表
const getRolePerson = async (data) => {
  return request.post(`/platform/roleAssignments/getOrgUserListByRole`, {
    data,
  });
}
// 新增
const getRoleAdd = async (data) => {
  return request.post(`/platform/roleResource/add`, {
    data,
  });
};
// 编辑
const getRoleUpdate = async (data) => {
  return request.post(`/platform/roleResource/update`, {
    data,
  });
};
// 删除右侧表格数据
const getRoleDelete = async (data) => {
  return request.get(`/platform/roleResource/delete?id=${data.id}`);
};
// 新增用户
const register = async (data) => {
  return request.post(`/auth/sysUser/register`, {
    data,
  });
};

// 引用用户
const registerOrg = async (data) => {
  return request.post(`/auth/sysUser/registerOrg`, {
    data,
  });
};

// 冻结用户
const freezeUser = async (data) => {
  return request.post(`/auth/sysUser/stopuser`, {
    data,
  });
};

// 获取用户详情
// ps: 后端要求 参数放 url 中
const getUserInfo = async (data) => {
  return request.post(`/auth/sysUser/getInfo?userId=${data.userId}`, {
    // data
  });
};

// 删除用户
const deleteUser = async (data) => {
  return request.post(`/auth/sysUser/deluser`, {
    data,
  });
};
// 编辑用户信息
const editUserInfo = async (data) => {
  return request.post(`/auth/sysUser/edit`, {
    data,
  });
};
// 批量新增获取数据
const getBatchList = async (data) => {
  return request.post(`/platform/sysResource/querySysResourceTree`, {
    data
  })
}
const getBatchAdd = async (data) => {
  return request.post(`/platform/roleResource/batchAdd`, {
    data
  })
}
// 成员维护获取数据
const getMemberMaintence = async (params) => {
    return request(`/platform/roleAssignments/getRoleUserConfigList`, {
      method: 'GET',
      params,
    });
}
const getMemberSure = async(params)  => {
  return request(`/platform/roleAssignments/batchAddSysUserRole`, {
    method: 'POST',
    data:params,
  });
}
// 获取资源列表数据
const getResourceList = async (data) => {
  return request.post(`/platform/sysOrgResource/queryResourceByOrgId`, {
    data
  })
}
// 获角色数据  树形数据
const getRoleTreedata = async (data) => {
  return request.get(`/platform/sysRole/getRoleTreeByOrg`,{data})
}
// 新增角色数据左侧
const getRoleTreeAdd = async (data) => {
  return request.post(`/platform/sysRole/addRole`,{data});
}
// 删除角色数据 左侧
const getRoleTreeDel = async (data) => {
  return request.get(`/platform/sysRole/delete?id=${data.id}`);
}
// 获取角色数据
const getRoleTreeDetail = async (data) => {
  return request.get(`/platform/sysRole/detail?id=${data.id}`);
}
// 修改角色数据
const getRoleTreeUpdate = async (data) => {
  return request.post(`/platform/sysRole/update`, {data});
}
// 查询角色人员列表下的权限维护  列表
const getMenuTableData = async (data) => {
  return request(`/platform/sysUserResource/getUserResourceConfigData`, {
    method: 'POST',
    data: data,
  });
}
// 人员角色列表删除
const getRolePersonDelete = async (params) => {
  return request(`/platform/sysUserRole/deleteRoleUser`, {
    method: 'GET',
    params,
  });
}
// 角色人员权限维护列表新增
const getRolePersonAdd = async (params) => {
  return request(`/platform/sysUserResource/add`, {
    method: 'POST',
    data: params,
  });
}
// 角色人员 权限维护列表修改
const getRolePersonUpdate = async (params) => {
  return request(`/platform/sysUserResource/update`, {
    method: 'POST',
    data: params,
  });
}
// 角色人员权限维护列表删除
const getRolePersonDel = async (params) => {
    return request(`/platform/sysUserResource/delete`, {
    method: 'GET',
    params,
  });
}
// 人员权限维护弹框确定
const getRolePersonSure = async (params) => {
  return request(`/platform/sysUserResource/setUserResourceConfig`, {
    method: 'POST',
    data: params,
  });
}
export {
  getRoleTreedata,
  getRoleTreeAdd,
  getRoleTreeDel,
  getRoleTreeUpdate,
  getRoleTreeDetail,
  getRoleLists,
  getRoleAdd,
  getRoleUpdate,
  getRoleDelete,
  deleteUser,
  editUserInfo,
  register,
  registerOrg,
  freezeUser,
  getUserInfo,
  getRolePerson,
  getResourceList,
  getBatchList,
  getMemberMaintence,
  getMemberSure,
  getMenuTableData,
  getRolePersonDelete,
  getRolePersonAdd,
  getRolePersonUpdate,
  getRolePersonDel,
  getRolePersonSure,
  getBatchAdd
};
