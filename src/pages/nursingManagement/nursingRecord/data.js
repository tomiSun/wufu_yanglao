import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
        name: '胡彦斌',
        archivesId: "L000001",
        careLevel: "一级",//字典
        bloodGlucose:"100",
        time:"2021-2-25",
        tiemType:"午饭前",
        takeTime:"2021-2-14 12:00:00"
    },
    {
        key: '2',
        name: '李佳敏',
        archivesId: "L000002",
        careLevel: "一级",//字典
        bloodGlucose:"48",
        time:"2021-2-26",
        tiemType:"午饭前",
        takeTime:"2021-2-14 16:20:10"
    }
];
const columns = (edit) => {
    return [
        {
            title: '住院编号',
            dataIndex: 'archivesId',
            key: 'archivesId',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '级别护理',
            dataIndex: 'careLevel',
            key: 'careLevel',
        },
        {
            title: '护理时间段',
            dataIndex: 'tiemType',
            key: 'tiemType',
        },
        {
            title: '护理日期',
            dataIndex: 'takeTime',
            key: 'takeTime',
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { dataSource, columns }