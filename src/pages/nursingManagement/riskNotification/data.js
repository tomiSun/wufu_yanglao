import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const dataSource = [
    {
        key: '1',
        name: '胡彦斌',
        archivesId: "L000001",
        careLevel: "一级",//字典
        idCard: "230402XXXX0726031X",
        contacts: "周杰",
        status: "1",
        informer: "周波波",
        time:"2021-2-25"
    },
    {
        key: '2',
        name: '李佳敏',
        archivesId: "L000002",
        careLevel: "一级",//字典
        idCard: "230402XXXX0726031X",
        contacts: "--",
        status: "0",
        informer: "--",
        time:"--"
    }
];
const columns = (edit) => {
    return [
        {
            title: '老人编号',
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
            title: '告知人姓名',
            dataIndex: 'informer',
            key: 'informer',
        },
        {
            title: '监护人姓名',
            dataIndex: 'contacts',
            key: 'contacts',
        },
        {
            title: '签订时间',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: '风险告知书签订状态',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                return (<div>
                    {value == "1" ? <Tag color="cyan">已签订</Tag> : <Tag color="red">未签订</Tag>}
                </div>)
            }
        },
        {
            title: '操作',
            render: edit
        }
    ];
}
export { dataSource, columns }