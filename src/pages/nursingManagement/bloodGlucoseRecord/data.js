
const columns = (edit, samplingStatusMap) => {
    return [
        {
            title: '住院号',
            dataIndex: 'businessNo',
            key: 'businessNo',
        },
        {
            title: '床位名称',
            dataIndex: 'bedName',
            key: 'bedName',
        },
        {
            title: '姓名',
            dataIndex: 'patientName',
            key: 'patientName',
        },
        {
            title: '血糖值(单位：mmol)',
            dataIndex: 'bloodGlucoseValue',
            key: 'bloodGlucoseValue',
        },
        {
            title: '采样日期',
            dataIndex: 'bloodSugarRecordDate',
            key: 'bloodSugarRecordDate',
        },
        {
            title: '采样时间',
            dataIndex: 'samplingTime',
            key: 'samplingTime',
        },
        {
            title: '采样状态',
            dataIndex: 'samplingStatus',
            key: 'samplingStatus',
            render: (text, record) => {
                let res = samplingStatusMap.find((item => {
                    return item['dictCode'] == text
                }))
                return !!res?.['dictName'] ? res['dictName'] : "-"
            }
        },
        {
            title: '采样签名',
            dataIndex: 'samplingSignature',
            key: 'samplingSignature',
        },
        {
            title: '医院诊断',
            dataIndex: 'hospitalDiagnosis',
            key: 'hospitalDiagnosis',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { columns }