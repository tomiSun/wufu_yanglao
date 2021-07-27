import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
         a:"Z0001",
         b:"张三",
         c:"一级",
         d:"2020-9-1",
         e:"2020-9-2",
         f:"外出就医",
         g:"张川",
         h:"李啵啵",
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
            title: '级别护理',
            dataIndex: 'c',
            key: 'careLevel',
        },
        {
            title: '请假开始日期',
            dataIndex: 'd',
            key: 'isFood',
        },
        {
            title: '请假结束日期',
            dataIndex: 'e',
            key: 'bloodGlucose',
        },
        {
            title: '请假原因',
            dataIndex: 'f',
            key: 'tiemType',
        },
        {
            title: '监护人',
            dataIndex: 'g',
            key: 'takeTime',
        },
        {
            title: '医院负责人',
            dataIndex: 'h',
            key: 'takeTime',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { dataSource, columns }