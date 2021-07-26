import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
        a: 'Z001',
        b: "9区",
        c: "1-1",//字典
        d:"张三",
        e:"奥氮平片5mg^20s",
        f:"25mg", 
        g:"临睡前",
        h:"每日2次"
    },
    {
        key: '1',
        a: 'Z002',
        b: "9区",
        c: "1-2",//字典
        d:"李四",
        e:"奥氮平片5mg^20s",
        f:"25mg", 
        g:"早",
        h:"每日1次"
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
            title: '病区',
            dataIndex: 'b',
            key: 'name',
        },
        {
            title: '床号',
            dataIndex: 'c',
            key: 'isFood',
        },
        {
            title: '姓名',
            dataIndex: 'd',
            key: 'bloodGlucose',
        },
        {
            title: '药品规格',
            dataIndex: 'e',
            key: 'tiemType',
        },
        {
            title: '剂量',
            dataIndex: 'f',
            key: 'takeTime',
        },
        {
            title: '频次',
            dataIndex: 'g',
            key: 'tiemType',
        },
        {
            title: '服药时间段',
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