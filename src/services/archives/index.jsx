import request from '@/utils/request';

// 档案-
export async function baseArchiveDel(params) {
  return request(`/baseArchive/del?ids=${params['id']}`, {
    method: 'GET',
    data: params
  });
};
export async function baseArchiveQuery(params) {
  return request('/baseArchive/baseArchivePage', {
    method: 'POST',
    data: params
  });
};

export async function baseArchiveUpdate(params) {
  return request('/baseArchive/update', {
    method: 'POST',
    data: params
  });
};
export async function baseArchiveInsert(params) {
  return request('/baseArchive/add', {
    method: 'POST',
    data: params
  });
};