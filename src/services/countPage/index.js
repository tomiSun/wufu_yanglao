import request from '@/utils/request';
export async function queryBrokenLine(params) {
    return request('/summary/queryBrokenLine', {
        method: 'POST',
        data: params
    });
}
export async function queryCake(params) {
    return request('/summary/queryCake', {
        method: 'POST',
        data: params
    });
}
export async function selectCountInfo(params) {
    return request('/summary/select', {
        method: 'POST',
        data: params
    });
}