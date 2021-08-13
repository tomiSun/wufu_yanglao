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
//带药管理
export async function takeMedicineInsert(params) {
  return request('/medicine/addTakeMedicine', {
    method: 'POST',
    data: params
  });
};
export async function takeMedicineQuery(params) {
  return request('/medicine/pageTakeMedicine', {
    method: 'POST',
    data: params
  });
};
export async function takeMedicineUpdate(params) {
  return request('/medicine/updateTakeMedicine', {
    method: 'POST',
    data: params
  });
};
export async function takeMedicineDel(params) {
  return request('/medicine/del', {
    method: 'GET',
    data: params
  });
};
//服药管理
export async function medicineRecordInsert(params) {
  return request('/medicine/addMedicationRecord', {
    method: 'POST',
    data: params
  });
};
export async function medicineRecordQuery(params) {
  return request('/medicine/pageMedicationRecord', {
    method: 'POST',
    data: params
  });
};
export async function medicationRecordUpdate(params) {
  return request('/medicine/updateMedicationRecord', {
    method: 'POST',
    data: params
  });
};
export async function medicineRecordDel(params) {
  return request('/medicine/delMedicationRecord', {
    method: 'GET',
    data: params
  });
};
//特级护理管理
export async function addSpecialNursing(params) {
  return request('/nursingManage/addSpecialNursing', {
    method: 'POST',
    data: params
  });
};
export async function pageSpecialNursing(params) {
  return request('/nursingManage/pageSpecialNursing', {
    method: 'POST',
    data: params
  });
};
export async function updateSpecialNursing(params) {
  return request('/nursingManage/updateSpecialNursing', {
    method: 'POST',
    data: params
  });
};
export async function delSpecialNursing(params) {
  return request('/nursingManage/delSpecialNursing', {
    method: 'GET',
    data: params
  });
};