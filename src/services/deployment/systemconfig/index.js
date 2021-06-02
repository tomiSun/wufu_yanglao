import request from '@/utils/request';
import createApi from '@/services/createApi';

export const systemLists = createApi('/auth/sysSystem/getList', 'POST'); // 系统应用列表
export const sysRegister = createApi('/auth/sysSystem/register', 'POST'); // 新增系统应用
export const editSystemInfo = createApi('/auth/sysSystem/edit', 'POST'); // 编辑系统应用信息
export const freezeSystem = createApi('/auth/sysSystem/changeStatus', 'POST'); // 冻结系统应用
export const getSystemInfo = createApi('/auth/sysSystem/getInfo', 'POST'); // 获取系统应用详情
export const deleteSystem = createApi('/auth/sysSystem/delSystem', 'POST'); // 删除系统应用
export const getNodetree = createApi('/auth/sysResource/getNodetree', 'POST'); // 获取资源树
export const addNodeTree = createApi('/auth/sysResource/register', 'POST'); // 添加资源
export const addChangeStatus = createApi('/auth/sysResource/changeStatus', 'POST'); // 添加资源状态
export const addEdit = createApi('/auth/sysResource/edit', 'POST'); //资源编辑
export const delNodeTree = createApi('/auth/sysResource/delResource', 'POST'); //删除资源
