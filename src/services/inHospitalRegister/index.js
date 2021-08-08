import request from '@/utils/request';

// 试用期评估
export async function trialAssessmentDel(params) {
  return request('/trial-assessment/delete', {
    method: 'GET',
    data: params
  });
};
export async function trialAssessmentQuery(params) {
  return request('/trial-assessment/query', {
    method: 'GET',
    data: params
  });
};

export async function trialAssessmentUpdate(params) {
  return request('/trial-assessment/update', {
    method: 'POST',
    data: params
  });
};
export async function trialAssessmentInsert(params) {
  return request('/trial-assessment/insert', {
    method: 'POST',
    data: params
  });
};
/**体检*/
export async function examArchiveDel(params) {
  return request(`/examArchive/delete?businessNo=${params.businessNo}`, {
    method: 'GET',
    data: params
  });
};
export async function examArchiveQuery(params) {
  return request(`/examArchive/select?businessNo=${params.businessNo}`, {
    method: 'GET',
    data: params
  });
};

export async function examArchiveUpdate(params) {
  return request('/examArchive/update', {
    method: 'POST',
    data: params
  });
};

export async function examArchiveSave(params) {
  return request('/examArchive/save', {
    method: 'POST',
    data: params
  });
};
//入院登记
export async function addHospitalRegist(params) {
  return request('/hospitalRegist/add', {
    method: 'POST',
    data: params
  });
}
export async function updateHospitalRegist(params) {
  return request('/hospitalRegist/update', {
    method: 'POST',
    data: params
  });
}

export async function queryHospitalRegist(params) {
  return request('/hospitalRegist/select', {
    method: 'POST',
    data: params
  });
}
//出院 
export async function outHospitalRegist(params) {
  return request(`/hospitalRegist/out?businessNo=${params.businessNo}`, {
    method: 'GET',
  });
}
//试用期评估
export async function assessmentDel(params) {
  return request(`/admission-assessment/delete?businessNo=${params.businessNo}`, {
    method: 'GET',
    data: params
  });
};
export async function assessmentQuery(params) {
  return request(`/admission-assessment/query?businessNo=${params.businessNo}`, {
    method: 'GET',
    data: params
  });
};

export async function assessmentUpdate(params) {
  return request('/admission-assessment/update', {
    method: 'POST',
    data: params
  });
};

export async function assessmentSave(params) {
  return request('/admission-assessment/insert', {
    method: 'POST',
    data: params
  });
};

