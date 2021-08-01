import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
       a:"Z0001",
       b:"张三",
       c:"2020-9-10",
       d:"无",
       e:"100ml",
       f:"120ml",
       g:"是",
       h:"良好",
       i:"糖尿病",
       g:"李啵啵",
       k:"无"
    },
    
];
const columns = (edit) => {
    return [
        {
            title: '住院编号',
            dataIndex: 'a',
            key: 'archivesId',
        },
        {
            title: '姓名',
            dataIndex: 'b',
            key: 'name',
        },
        {
            title: '护理日期',
            dataIndex: 'c',
            key: 'careLevel',
        },
        {
            title: '是否有过敏史',
            dataIndex: 'd',
            key: 'isFood',
        },
        {
            title: '出量',
            dataIndex: 'e',
            key: 'bloodGlucose',
        },
        {
            title: '入量',
            dataIndex: 'f',
            key: 'tiemType',
        },
        {
            title: '预防压疮护理',
            dataIndex: 'g',
            key: 'takeTime',
        },
        {
            title: '精神状态',
            dataIndex: 'h',
            key: 'bloodGlucose',
        },
        {
            title: '医院诊断',
            dataIndex: 'i',
            key: 'tiemType',
        },
        {
            title: '责任人',
            dataIndex: 'g',
            key: 'takeTime',
        },
        {
            title: '其他',
            dataIndex: 'k',
            key: 'takeTime',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { dataSource, columns }