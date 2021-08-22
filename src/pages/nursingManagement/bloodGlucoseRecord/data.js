
const columns = (edit, samplingStatusMap) => {
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
            key: 'patientName',
            width: 100,
            fixed: 'left'
        },
        {
            title: '血糖值(单位：mmol)',
            dataIndex: 'bloodGlucoseValue',
            key: 'bloodGlucoseValue',
            width: 200,
        },
        {
            title: '采样日期',
            dataIndex: 'bloodSugarRecordDate',
            key: 'bloodSugarRecordDate',
            width: 200,
        },
        {
            title: '采样时间',
            dataIndex: 'samplingTime',
            key: 'samplingTime',
            width: 200,
        },
        {
            title: '采样状态',
            dataIndex: 'samplingStatus',
            key: 'samplingStatus',
            width: 120,
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
            width: 120,
        },
        {
            title: '医院诊断',
            dataIndex: 'hospitalDiagnosis',
            key: 'hospitalDiagnosis',
            width: 120,
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