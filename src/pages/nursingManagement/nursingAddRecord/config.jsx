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
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: (t, r) => {
                return t == "1" ? "男" : "女"
            }
        },
        {
            title: '床号',
            dataIndex: 'bedCode',
            key: 'bedCode',
            render: (t, r) => {
                return t
            }
        },
    ];
}
export { columns }