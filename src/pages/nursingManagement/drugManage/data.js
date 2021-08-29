import { getDictNameByCode } from '@/utils/common.js'
const columns = (edit, dictionaryMap) => {
    return [
        // {
        //     title: '住院号',
        //     dataIndex: 'businessNo',
        //     key: 'businessNo',
        // },
        // {
        //     title: '床号',
        //     dataIndex: 'bedCode',
        //     key: 'bedCode',
        // },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },

        {
            title: '年龄',
            dataIndex: 'sex',
            key: 'sex',
        },
        {
            title: '诊断',
            dataIndex: 'hospitalDiagnosis',
            key: 'hospitalDiagnosis',
            // render: (t, r) => {
            //     return getDictNameByCode(dictionaryMap, "0015", t)
            // }
        },
        {
            title: '带药日期',
            dataIndex: 'takeMedicineDate',
            key: 'takeMedicineDate',
        },
        {
            title: '药品名称',
            dataIndex: 'drugName',
            key: 'drugName',
        },
        {
            title: '用法',
            dataIndex: 'usage',
            key: 'usage',
        },
        {
            title: '用量',
            dataIndex: 'dosage',
            key: 'dosage',
        },
        {
            title: '带药量',
            dataIndex: 'measure',
            key: 'measure',
        },
        {
            title: '自带药',
            dataIndex: 'l',
            key: 'bloodGlucose',
        },
        {
            title: '验收人',
            dataIndex: 'accepterSign',
            key: 'accepterSign',
        },
        {
            title: '过期时间',
            dataIndex: 'expiryDate',
            key: 'expiryDate',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { columns }