import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
        name: '胡彦斌',
        sex: "男",//字典
        age: 32,
        careLevel: "一级",//字典
        diagnosis: '高血压',//字典
        allergy: "无",//字典？
        pastHistory: "糖尿病",
        address: '西湖区湖底公园1号',
        idCard: "230402XXXX0726031X",
        contacts: "周杰",
        relationship: "儿子",
        contactsPhone: "13745880987",
        inTime: "2021-7-28"
    }
];
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
            dataIndex: 'careLevel',
            key: 'careLevel',
        },
        {
            title: '入院诊断',
            dataIndex: 'diagnosis',
            key: 'diagnosis',
        },
        {
            title: '入院时间',
            dataIndex: 'inTime',
            key: 'inTime',
        },
        {
            title: '过敏史',
            dataIndex: 'allergy',
            key: 'allergy',
        },
        {
            title: '既往史',
            dataIndex: 'pastHistory',
            key: 'pastHistory',
        },
        {
            title: '家庭住址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '身份证号',
            dataIndex: 'idCard',
            key: 'idCard',
        },
        {
            title: '联系人姓名',
            dataIndex: 'contacts',
            key: 'contacts',
        },
        {
            title: '关系',
            dataIndex: 'relationship',
            key: 'relationship',
        },
        {
            title: '联系电话',
            dataIndex: 'contactsPhone',
            key: 'contactsPhone',
        },
        {
            title: '操作',
            width: 500,
            render: edit
        }
    ];
}
export { dataSource, columns }