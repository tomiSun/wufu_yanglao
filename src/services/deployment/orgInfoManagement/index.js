
import request from '@/utils/request';

export async function getSysO(params) {
    return request.get('/basic/sysOrg/tree', {
       params,
    });
}

export async function getSysOrgTree(params) {
    return request.get('sysOrg/getSysOrgByParent', {
     params,
    });
}
export async function getSysOrgTreeY(params) {
    return request.get('y/mock/64/sysOrg/getSysOrgByParent', {
     params,
    });
}
export async function getSysOrgDetail(params) {
    return request.get('/sysOrg/detail', {
     params,
    });
}
export async function getSysOrgDetailY(params) {
    return request.get('y/mock/64/sysOrg/detail', {
     params,
    });
}
export async function sysOrgAdd(params) {
    return request.post('/sysOrg/add', {
     data:params,
    });
}
export async function sysOrgAddY(params) {
    return request.post('y/mock/64/sysOrg/add', {
     data:params,
    });
}
export async function sysOrgUpdate(params) {
    return request.post('/sysOrg/update', {
     data:params,
    });
}
export async function sysOrgUpdateY(params) {
    return request.post('y/mock/64/sysOrg/update', {
     data:params,
    });
}
export async function delSysOrg(params) {
    return request.post('/sysOrg/delete', {
     data:params,
    });
}
export async function delSysOrgY(params) {
    return request.post('y/mock/64/sysOrg/delete', {
     data:params,
    });
}
export async function getOrgUser(params) {
    return request.post('/orgDepartmentUser/fuzzyPageQuery', {
     data:params,
    });
}
export async function getOrgUserY(params) {
    return request.post('y/mock/64/orgDepartmentUser/fuzzyPageQuery', {
     data:params,
    });
}
// export async function getOrgDepartment(params) {
//     return request.post('x/orgDepartment/treeNode', {
//      data:params,
//     });
// }
export async function getOrgDepartmentY(params) {
    return request.post('y/mock/64/orgDepartment/query', {
     data:params,
    });
}
export async function getOrgDepartment(params) {
    return request.post('/orgDepartment/query', {
     data:params,
    });
}
export async function getOrgSysResource(params) {
    return request.post('x/sysResource/page', {
     data:params,
    });
}
export async function getOrgSysRole(params) {
    return request.post('x/sysRole/data', {
     data:params,
    });
}
export async function getOrgSysRoleResource(params) {
    return request.post('x/orgManagement/rolePermit', {
     data:params,
    });
}
// export async function getValueListByCode(params) {
//     return request.post('/basic/pubDict/getValueListByCode', {
//       data: params,
//     });
// }
export async function getValueListByCode(params) {
    return request.post('/dict/dictPub/batchQueryDictListPub', {
      data: params,
    });
  }