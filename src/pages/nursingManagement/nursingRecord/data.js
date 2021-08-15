
const columns = (edit) => {
    return [
        {
            title: '住院编号',
            dataIndex: 'businessNo',
            key: 'businessNo',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '护理日期',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '护理时间段',
            dataIndex: 'timePoint',
            key: 'timePoint',
        },
        {
            title: '体温（°C）',
            dataIndex: 'temperature',
            key: 'temperature',
        },
        {
            title: '脉搏心率（次/分）',
            dataIndex: 'pulse',
            key: 'pulse',
        },
        {
            title: '呼吸',
            dataIndex: 'breathing',
            key: 'breathing',
        },
        {
            title: '高压',
            dataIndex: 'highBloodPressure',
            key: 'highBloodPressure',
        },
        {
            title: '低压',
            dataIndex: 'lowBloodPressure',
            key: 'lowBloodPressure',
        },
        {
            title: '是否打扫房间',
            dataIndex: 'isCleanRoom',
            key: 'isCleanRoom',
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否清洗便池',
            dataIndex: 'isCleanToilet',
            key: 'tiemType',
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否洗头理发',
            dataIndex: 'isHaircut',
            key: 'isHaircut',
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否晾晒衣服',
            dataIndex: 'isHangClothes',
            key: 'isHangClothes',
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否修剪指甲',
            dataIndex: 'isManicure',
            key: 'isManicure',
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '是否进餐送餐',
            dataIndex: 'isMeals',
            key: 'isMeals',
            render: (t, r) => {
                return t == "0" ? "是" : "否"
            }
        },
        {
            title: '老人身心观察记录',
            dataIndex: 'physicalAndMentalStatus',
            key: 'physicalAndMentalStatus',
        },
        {
            title: '其他',
            dataIndex: 'other',
            key: 'other',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { columns }
