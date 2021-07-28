import request from '@/utils/request';

// 新增床位信息
export async function bedAdd(params) {
  return request('/bed/bed/insert', {
    method: 'POST',
    data: params
  });
};
// 删除床位信息
export async function bedInfoDel(params) {
  return request('/bed/bed/delete', {
    method: 'POST',
    data: params
  });
};
// 查询床位信息
export async function bedQuery(params) {
  return request('/bed/bed/query', {
    method: 'GET',
    data: params
  });
};
// 更新床位信息 
export async function bedUpdate(params) {
  return request('/bed/bed/update', {
    method: 'POST',
    data: params
  });
};
// ----------
// 删除楼宇信息  
export async function bedBuildDelete(params) {
    return request('/bed/building/delete', {
      method: 'GET',
      data: params
    });
  };
// 获取楼宇下拉列表
  export async function bedBuildList(params) {
    return request('/bed/building/get-list', {
      method: 'GET',
      data: params
    });
  };
  // 新增楼宇信息
export async function bedBuildAdd(params) {
  return request('/bed/building/insert', {
    method: 'POST',
    data: params
  });
};

// 查询楼宇信息
export async function bedBuildQuery(params) {
  return request('/bed/building/query', {
    method: 'GET',
    data: params
  });
};

// 更新楼宇信息
export async function bedBuildUpdate(params) {
  return request('/bed/building/update', {
    method: 'POST',
    data: params
  });
};

// 删除楼层信息
export async function bedFloorDelete(params) {
  return request('/bed/floor/delete', {
    method: 'GET',
    data: params
  });
};
// 获取楼层下拉列表
export async function bedFloorList(params) {
  return request('/bed/floor/get-list', {
    method: 'GET',
    data: params
  });
};

// /bed/floor/insert
// 新增楼层信息
export async function bedFloorAdd(params) {
  return request('/bed/floor/insert', {
    method: 'POST',
    data: params
  });
};

// 查询楼层信息
export async function bedFloorQuery(params) {
  return request('/bed/floor/query', {
    method: 'POST',
    data: params
  });
};

// 更新楼层信息
export async function bedFloorUpdate(params) {
  return request('/bed/floor/update', {
    method: 'POST',
    data: params
  });
};
// 删除房间信息
export async function bedRoomDelete(params) {
  return request('/bed/room/delete', {
    method: 'GET',
    data: params
  });
};

// 获取房间下拉列表
export async function bedRoomList(params) {
  return request('/bed/room/get-list', {
    method: 'GET',
    data: params
  });
};

// 新增房间信息
export async function bedRoomAdd(params) {
  return request('/bed/room/insert', {
    method: 'POST',
    data: params
  });
};
// 查询房间信息
export async function bedRoomQuery(params) {
  return request('/bed/room/query', {
    method: 'GET',
    data: params
  });
};

// 更新房间信息
export async function bedRoomUpdate(params) {
  return request('/bed/room/update', {
    method: 'POST',
    data: params
  });
};
// 床位tree
export async function bedTree(params) {
  return request('/bed/tree', {
    method: 'GET',
    data: params
  });
};