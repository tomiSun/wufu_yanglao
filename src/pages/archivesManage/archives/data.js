import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';

const columns = (edit) => {
    return [
        {
            title: '档案编号',
            dataIndex: 'id',
            key: ' id',
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
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '身份证号',
            dataIndex: 'idCard',
            key: 'idCard',
        },
        {
            title: '联系地址',
            dataIndex: 'contactAddress',
            key: 'contactAddress',
        },
        {
            title: '联系电话',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
        },
        {
            title: '联系人姓名',
            dataIndex: 'guardianName',
            key: 'guardianName',
        },
        {
            title: '关系',
            dataIndex: 'relation',
            key: 'relation',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { columns }