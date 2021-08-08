import request from '@/utils/request';

// 护理-血糖
export async function bloodSugarDel(params) {
  return request(`/blood-sugar/delete?id=${params['id']}`, {
    method: 'GET',
    data: params
  });
};
export async function bloodSugarQuery(params) {
  return request('/blood-sugar/query', {
    method: 'POST',
    data: params
  });
};

export async function bloodSugarUpdate(params) {
  return request('/blood-sugar/update', {
    method: 'POST',
    data: params
  });
};
export async function bloodSugarInsert(params) {
  return request('/blood-sugar/insert', {
    method: 'POST',
    data: params
  });
};
