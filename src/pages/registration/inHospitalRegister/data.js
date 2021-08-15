const formatStr = (str) => {
    return str.replace("[\"", "").replace("\"]", "").replace('"', "").replace('"', "")
}
const columns = (edit) => {
    return [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '级别护理',
            dataIndex: 'nursingLevel',
            key: 'nursingLevel',
        },
        {
            title: '入院诊断',
            dataIndex: 'hospitalDiagnosis',
            key: 'hospitalDiagnosis',
        },
        {
            title: '入院时间',
            dataIndex: 'admissionTime',
            key: 'admissionTime',
        },
        {
            title: '费用到期时间',
            dataIndex: 'feesDueDate',
            key: 'feesDueDate',
        },
        {
            title: '费用到期标志',
            dataIndex: 'feesDueStatue',
            key: 'feesDueStatue',
            render: (t, r) => {
                if (t == null) {
                    return "-"
                }
                return t == "0" ? "正常" : "欠费"
            }
        },
        {
            title: '床位号',
            dataIndex: 'bedCode',
            key: 'bedCode',
        },
        {
            title: '过敏史',
            dataIndex: 'allergy',
            key: 'allergy',
            render: (t, r) => {
                if (t == null) {
                    return "-"
                }
                return formatStr(t)
            }
        },
        {
            title: '既往史',
            dataIndex: 'previousHistory',
            key: 'previousHistory',
            render: (t, r) => {
                if (t == null) {
                    return "-"
                }
                return formatStr(t)
            }
        },
        {
            title: '家庭住址',
            dataIndex: 'contactAddress',
            key: 'contactAddress',
        },
        {
            title: '身份证号',
            dataIndex: 'idCard',
            key: 'idCard',
        },
        {
            title: '联系人姓名',
            dataIndex: 'relationName',
            key: 'relationName',
        },
        {
            title: '关系',
            dataIndex: 'relation',
            key: 'relation',
        },
        {
            title: '联系电话',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
        },
        {
            title: '操作',
            render: edit,
        }
    ];
}
export { columns }