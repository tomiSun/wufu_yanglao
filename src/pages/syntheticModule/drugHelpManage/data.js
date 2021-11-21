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
            title: '药品名称及规格',
            dataIndex: 'drugName',
            key: 'drugName',
        },
        {
            title: '用法',
            dataIndex: 'useWay',
            key: 'useWay',
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
            title: '代配药',
            dataIndex: 'isTaken',
            key: 'isTaken',
            render: (t, v) => {
                return Number(t) === 0 ? "否" : "是"
            }
        },
        {
            title: '护士签名',
            dataIndex: 'nursingSign',
            key: 'nursingSign',
        },
        {
            title: '家属签名',
            dataIndex: 'familySign',
            key: 'familySign',
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