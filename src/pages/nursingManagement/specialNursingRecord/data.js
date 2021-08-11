const columns = (edit) => {
    return [
        {
            title: '住院编号',
            dataIndex: 'businessNo',
            key: 'businessNo',
        },
        {
            title: '床号',
            dataIndex: 'bedName',
            key: 'bedName',
        },
        {
            title: '姓名',
            dataIndex: 'patientName',
            key: 'name',
        },
        {
            title: '护理日期',
            dataIndex: 'nursingTime',
            key: 'nursingTime',
        },
        {
            title: '是否有过敏史',
            dataIndex: 'allergy',
            key: 'allergy',
        },
        {
            title: '出量',
            dataIndex: 'output',
            key: 'bloodGlucose',
        },
        {
            title: '入量',
            dataIndex: 'input',
            key: 'input',
        },
        {
            title: '预防压疮护理',
            dataIndex: 'isPressureUlcersCare',
            key: 'isPressureUlcersCare',
        },
        {
            title: '医院诊断',
            dataIndex: 'hospitalDiagnosis',
            key: 'hospitalDiagnosis',
        },
        {
            title: '责任人',
            dataIndex: 'personInCharge',
            key: 'personInCharge',
        },
        {
            title: '精神状态',
            dataIndex: 'mentalState',
            key: 'mentalState',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { columns }