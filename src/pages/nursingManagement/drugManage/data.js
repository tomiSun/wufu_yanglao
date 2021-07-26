import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
        a: 'Z0001',
        b: "9区",
        c: "1-1",//字典
        d: "李翔",
        e: "男",
        f: "78",
        g: "每日两次",
        h: "2021-7-3",
        i: '桂林枇杷霜',
        g: "每日两次",
        k: "5mg",//字典
        l: "是",
        m: "有高血压"
    },
    {
        key: '2',
        a: 'Z0002',
        b: "9区",
        c: "1-2",//字典
        d: "李敏",
        e: "女",
        f: "78",
        g: "每日两次",
        h: "2021-7-3",
        i: '桂林枇杷霜',
        g: "每日两次",
        k: "5mg",//字典
        l: "是",
        m: "有高血压、低血糖"
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
            title: '病区',
            dataIndex: 'b',
            key: 'name',
        },
        {
            title: '床号',
            dataIndex: 'c',
            key: 'careLevel',
        },
        {
            title: '姓名',
            dataIndex: 'd',
            key: 'isFood',
        },
        {
            title: '性别',
            dataIndex: 'e',
            key: 'bloodGlucose',
        },
        {
            title: '年龄',
            dataIndex: 'f',
            key: 'tiemType',
        },
        {
            title: '诊断',
            dataIndex: 'g',
            key: 'takeTime',
        },
        {
            title: '登记日期',
            dataIndex: 'h',
            key: 'archivesId',
        },
        {
            title: '药品名称',
            dataIndex: 'i',
            key: 'name',
        },
        {
            title: '用法',
            dataIndex: 'g',
            key: 'careLevel',
        },
        {
            title: '用量',
            dataIndex: 'k',
            key: 'isFood',
        },
        {
            title: '自带药',
            dataIndex: 'l',
            key: 'bloodGlucose',
        },
        {
            title: '备注',
            dataIndex: 'm',
            key: 'tiemType',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { dataSource, columns }