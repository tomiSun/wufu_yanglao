import { Button, Card, Col, Form, List, Row, Select, Tag, Table, Radio, Input, DatePicker, Modal, InputNumber } from 'antd';
const columns = (edit) => {
    return [
        {
            title: '住院号',
            dataIndex: 'businessNo',
            key: 'businessNo',
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '告知人姓名',
            dataIndex: 'informer',
            key: 'informer',
        },
        {
            title: '监护人姓名',
            dataIndex: 'guardian',
            key: 'guardian',
        },
        {
            title: '签订时间',
            dataIndex: 'guardianTime',
            key: 'guardianTime',
        },
        {
            title: '风险告知书签订状态',
            dataIndex: 'isSignNotification',
            key: 'isSignNotification',
            render: (value) => {
                return (<div>
                    {value == "1" ? <Tag color="cyan">已签订</Tag> : <Tag color="red">未签订</Tag>}
                </div>)
            }
        },
        // {
        //     title: '操作',
        //     render: edit
        // }
    ];
}
export {  columns }