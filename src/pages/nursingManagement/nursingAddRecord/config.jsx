const columns = (edit) => {
    return [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            width: 150
        },
        {
            title: '床号',
            dataIndex: 'bedName',
            key: 'bedName',
            width: 150,
            render: (t, r) => {
                let res = `${r['buildingName'] || "#"}-${r['floorName'] || "#"}-${r['roomName'] || "#"}-${r['bedName'] || "#"}`
                return res
            }
        },
    ];
}
export { columns }