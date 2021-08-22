import request from '@/utils/request';

// 试用期评估
export async function trialAssessmentDel(params) {
  return request(`/trial-assessment/delete?businessNo=${params.businessNo}`, {
    method: 'GET',
    data: params
  });
};
export async function trialAssessmentQuery(params) {
  return request(`/trial-assessment/query?businessNo=${params.businessNo}`, {
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
  return request(`/hospitalRegist/out?businessNo=${params.businessNo}&to=${params.peopleTo}`, {
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

//风险告知书
export async function riskNotificationQuery(params) {
  return request(`/risk-notification/query?businessNo=${params.businessNo}`, {
    method: 'GET',
    data: params
  });
};
export async function riskNotificationQueryList(params) {
  return request(`/risk-notification/query/page`, {
    method: 'POST',
    data: params
  });
};
export async function riskNotificationUpdate(params) {
  return request('/risk-notification/update', {
    method: 'POST',
    data: params
  });
};

export async function riskNotificationSave(params) {
  return request('/risk-notification/insert', {
    method: 'POST',
    data: params
  });
};

//合同
export async function contractQuery(params) {
  return request(`/contract/query?businessNo=${params.businessNo}`, {
    method: 'GET',
    data: params
  });
};
export async function contractQueryList(params) {
  return request(`/contract/query/page`, {
    method: 'POST',
    data: params
  });
};
export async function contractUpdate(params) {
  return request('/contract/update', {
    method: 'POST',
    data: params
  });
};

export async function contractSave(params) {
  return request('/contract/insert', {
    method: 'POST',
    data: params
  });
};
//根据名字查询病人信息
export async function patientQuery(params) {
  return request(`/page/patient/query?keyWords=${params.keyWords}`, {
    method: 'GET',
    data: params
  });
}

//床位查找
export async function queryBed(params) {
  return request(`/bed/bed/get-list?keyWords=${params['keyWords']}`, {
    method: 'GET',
    data: params
  });
}
