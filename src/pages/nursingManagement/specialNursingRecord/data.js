import { getDictNameByCode } from '@/utils/common.js'
const columns = (edit, dictionaryMap) => {
    return [
        {
            title: '住院号',
            dataIndex: 'businessNo',
            key: 'businessNo',
            width: 200,
            fixed: 'left'
        },
        // {
        //     title: '床位名称',
        //     dataIndex: 'bedName',
        //     key: 'bedName',
        //     width: 200,
        //     fixed: 'left',
        //     render: (t, r) => {
        //         let res = `${r['buildingName'] || "#"}-${r['floorName'] || "#"}-${r['roomName'] || "#"}-${r['bedName'] || "#"}`
        //         return res
        //     }
        // },
        {
            title: '姓名',
            dataIndex: 'patientName',
            key: 'name',
            width: 120,
            fixed: 'left'
        },
        {
            title: '护理日期',
            dataIndex: 'nursingTime',
            key: 'nursingTime',
            width: 200,
        },
        {
            title: '是否有过敏史',
            dataIndex: 'allergy',
            key: 'allergy',
            width: 100,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '出量',
            dataIndex: 'output',
            key: 'bloodGlucose',
            width: 80,
        },
        {
            title: '入量',
            dataIndex: 'input',
            key: 'input',
            width: 80,
        },
        {
            title: '预防压疮护理',
            dataIndex: 'isPressureUlcersCare',
            key: 'isPressureUlcersCare',
            width: 200,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '医院诊断',
            dataIndex: 'hospitalDiagnosis',
            key: 'hospitalDiagnosis',
            width: 200,
            // render: (t, r) => {
            //     return getDictNameByCode(dictionaryMap, "0015", t)
            // }
        },
        {
            title: '责任人',
            dataIndex: 'personInCharge',
            key: 'personInCharge',
            width: 200,
        },
        {
            title: '精神状态',
            dataIndex: 'mentalState',
            key: 'mentalState',
            width: 200,
        },
        {
            title: '操作',
            render: edit,
            width: 200,
            fixed: 'right'
        }
    ];
}
export { columns }