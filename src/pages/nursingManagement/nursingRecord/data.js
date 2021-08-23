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
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            fixed: 'left'
        },
        {
            title: '护理日期',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 200,
        },
        {
            title: '护理时间段',
            dataIndex: 'timePoint',
            key: 'timePoint',
            width: 200,
            render: (t, r) => {
                return getDictNameByCode(dictionaryMap, "0006", t)
            }
        },
        {
            title: '体温（°C）',
            dataIndex: 'temperature',
            key: 'temperature',
            width: 200,
        },
        {
            title: '脉搏心率（次/分）',
            dataIndex: 'pulse',
            key: 'pulse',
            width: 200,
        },
        {
            title: '呼吸',
            dataIndex: 'breathing',
            key: 'breathing',
            width: 120,
        },
        {
            title: '高压',
            dataIndex: 'highBloodPressure',
            key: 'highBloodPressure',
            width: 120,
        },
        {
            title: '低压',
            dataIndex: 'lowBloodPressure',
            key: 'lowBloodPressure',
            width: 120,
        },
        {
            title: '是否打扫房间',
            dataIndex: 'isCleanRoom',
            key: 'isCleanRoom',
            width: 120,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否清洗便池',
            dataIndex: 'isCleanToilet',
            key: 'tiemType',
            width: 120,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否洗头理发',
            dataIndex: 'isHaircut',
            key: 'isHaircut',
            width: 120,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否晾晒衣服',
            dataIndex: 'isHangClothes',
            key: 'isHangClothes',
            width: 120,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否修剪指甲',
            dataIndex: 'isManicure',
            key: 'isManicure',
            width: 120,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否进餐送餐',
            dataIndex: 'isMeals',
            key: 'isMeals',
            width: 120,
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '老人身心观察记录',
            dataIndex: 'physicalAndMentalStatus',
            key: 'physicalAndMentalStatus',
            width: 200,
        },
        {
            title: '其他',
            dataIndex: 'other',
            key: 'other',
            width: 200,
        },
        {
            title: '操作',
            render: edit,
            width: 120,
            fixed: 'right'
        }
    ];
}
export { columns }
