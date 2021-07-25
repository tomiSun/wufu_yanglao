import request from '@/utils/request';

// 登录接口
export async function logining(params) {
  return request('/validation/login', {
    method: 'POST',
    data: params,
  });
  // return request('/auth/sysUser/login', {
  //   method: 'POST',
  //   data: params,
  // });
}
// 手机号登录接口
export async function verificationCodeLogin(params) {
  return request('/platform/sysUser/verificationCodeLogin', {
    method: 'POST',
    data: params,
  });
}
// 获取验证码
export async function sendSmsByWeiMai(params) {
  // return request(`/login/captcha?mobile=${mobile}`);
  return request('/platform/sms/sendSmsByWeiMai', {
    method: 'POST',
    data: params,
  });
}
// 用户登录检查
export async function loginCheck(params) {
  return request('/platform/sysUser/loginCheck', {
    method: 'POST',
    data: params,
  });
}
// 用户修改密码
export async function userChangePassword(params) {
  return request('/platform/sysUser/userChangePassword', {
    method: 'POST',
    data: params,
  });
}
// 忘记密码
export async function forgetPassword(params) {
  return request('/platform/sysUser/forgetPassword', {
    method: 'POST',
    data: params,
  });
}

// 获取钉钉二维码
export function getQrCodeInfo(params) {
  return request('/platform/testDing/getQrCodeInfo', {
    method: 'GET',
    params,
  });
}
// 钉钉二维码授权状态检查 需前端轮询调用
export function getScanStatus(params) {
  return request('/platform/testDing/getScanStatus', {
    method: 'POST',
    data: params,
  });
}

// 验证token接口
export async function tokenVerify(params) {
  // return request('/auth/sysUserRoleRel/getTokenRoleList', {
  //   method: 'POST',
  //   data: params,
  // });
  return request('/platform/sysRole/getUserRole', {
    method: 'GET',
    params,
  });
}

// 选择角色
export async function checkRole(params) {
  // return request(`/auth/sysUser/checkRole?roleId=${params}`, {
  //   method: 'GET',
  // });
  return request(`/platform/sysUser/checkRole/${params.roleid}`, {
    method: 'GET',
  });
}

// 退出
export async function loginout(params) {
  // return request('/auth/sysUser/loginout', {
  //   method: 'POST',
  //   data: params,
  // });
  return request('/platform/sysUser/loginout', {
    method: 'POST',
    data: params,
  });
}

// 获取路由/菜单方法
export function getNodetree(params) {
  // return request('/auth/sysResource/getNodetree', {
  //   method: 'POST',
  //   data: params,
  // });
  return request('/platform/sysUser/getRoleMenu', {
    method: 'GET',
    params,
  });
}

// 获取仓库
export function getWareHouse(params) {
  return request('/depot/depotInfo/queryDepotList', {
    method: 'POST',
    data: params,
  });
}

// 修改基础信息
export function editUserInfo(params) {
  return request('/platform/sysUser/editUserInfoSelf', {
    method: 'POST',
    data: params,
  });
}
// 校验本机构内用户密码正确性
export function checkOrgUserPassword(params) {
  return request('/platform/sysUser/checkOrgUserPassword', {
    method: 'POST',
    data: params,
  });
}
