import { getDictNameByCode } from '@/utils/common.js'
const columns = (edit, dictionaryMap) => {
    return [
        {
            title: '住院号',
            dataIndex: 'businessNo',
            key: 'businessNo',
        },
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
            title: '药品名称及规格',
            dataIndex: 'drugSpecification',
            key: 'drugSpecification',
        },
        {
            title: '剂量',
            dataIndex: 'measure',
            key: 'measure',
        },
        {
            title: '频次',
            dataIndex: 'frequency',
            key: 'frequency',
        },
        {
            title: '用药日期',
            dataIndex: 'medicationDate',
            key: 'medicationDate',
        },
        {
            title: '用药时间',
            dataIndex: 'medicationTime',
            key: 'medicationTime',
            render: (t, r) => {
                return getDictNameByCode(dictionaryMap, "0019", t)
            }
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { columns }