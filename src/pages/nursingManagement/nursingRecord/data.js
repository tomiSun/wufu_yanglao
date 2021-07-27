import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
        a:"Z001",
        b:"张三",
        c:"2020-7-20",
        d:"早",
        e:"37",
        f:"120",
        g:"10",
        h:"100",
        l:"12",
        m:"良好",
        n:"无"
    }
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
            title: '护理时间段',
            dataIndex: 'd',
            key: 'tiemType',
        },
        {
            title: '体温（°C）',
            dataIndex: 'e',
            key: 'takeTime',
        },
        {
            title: '脉搏心率（次/分）',
            dataIndex: 'f',
            key: 'name',
        },
        {
            title: 'R（次/分）',
            dataIndex: 'g',
            key: 'careLevel',
        },
        {
            title: 'BP mmHg（次/分）',
            dataIndex: 'h',
            key: 'tiemType',
        },
        {
            title: '基础护理',
            dataIndex: 'l',
            key: 'takeTime',
        },
        {
            title: '老人身心观察记录',
            dataIndex: 'm',
            key: 'tiemType',
        },
        {
            title: '其他',
            dataIndex: 'n',
            key: 'takeTime',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { dataSource, columns }