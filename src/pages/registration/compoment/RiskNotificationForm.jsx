/**试用期评估 */
import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Select,
    Radio,
    Row,
    Col,
    Input,
    DatePicker,
    Modal,
    message
} from 'antd';
import {
    riskNotificationQuery,
    riskNotificationUpdate,
    riskNotificationSave
} from '@/services/inHospitalRegister/index.js'
let info1 = { "archiveId": "457947338305048576", "businessNo": "202107201654" }
let info2 = { "archiveId": "465188927389700096", "businessNo": "77" }
let record = info1
const layout = (x, y) => {
    return {
        labelCol: { span: x },
        wrapperCol: { span: y },
    }
};
const validateMessages = {
    required: '${label} is required!',
};
const RiskNotificationForm = (props) => {
    //属性
    const { selectRowData, onRiskNotificationFormVisible, visible } = props;
    //变量
    const [mode, setMode] = useState("add");//模式是新增还是编辑
    //form
    const [riskNotificationForm] = Form.useForm();//基础与总结
    //更新时的ID
    const [updateId, setUpdateId] = useState("")
    useEffect(() => {
        initData()
    }, []);
    //初始化 判断是新增还是编辑
    const initData = async () => {
        riskNotificationForm.setFieldsValue(record)
        let resQuery = await riskNotificationQuery({ "businessNo": record['businessNo'] })
        if (resQuery['code'] == 200 && !!resQuery['data']) {
            let id = resQuery['data']['busExamArchiveQueryVO']['id']
            setUpdateId(id)
            setMode("edit")
        } else {
            setMode("add")
        }
    }
    //体检弹窗
    const renderAgreementModal = () => {
        return (
            <Modal
                title="入住合同"
                width={1000}
                visible={visible}
                onOk={() => {
                    setModalVisible(false);
                }}
                onCancel={() => {
                    setModalVisible(false);
                }}
                style={{ marginTop: -50, marginRight: 120 }}
                footer={renderBtnArea()}
            >
                <div style={{ padding: 30 }}>
                    <h2 style={{ textAlign: 'center' }}>
                        <a>杭州富阳颐乐老年护理中心入住老人潜在意外风险告知书</a>
                    </h2>
                    <Form onFinish={() => { }} {...layout(8, 16)} style={{ marginTop: 20 }}>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="负责人签名:" name={'director'}>
                                    <Input width="200" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="签订时间" name={'directorTime'}>
                                    <DatePicker style={{ width: 200 }} size="small" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item label="监护人签名" name={'guardian'}>
                                    <Input width="200" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="签订时间" name={'guardianTime'}>
                                    <DatePicker style={{ width: 200 }} size="small" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        )
    }
    const renderBtnArea = () => {
        //新增按钮
        let addBtn = <Button onClick={async () => {
            let addParam = { ...riskNotificationForm.getFieldsValue(), ...selectRowData }
            let res = await riskNotificationSave(addParam);
            message.info("新增成功")
            onPhysicalExaminationVisible(false);
        }}>保存</Button>;
        //编辑按钮
        let editBtn = <Button onClick={async () => {
            let updateParam = { ...riskNotificationForm.getFieldsValue(), ...selectRowData }
            let res = await riskNotificationUpdate(updateParam);
            message.info("修改成功")
            onPhysicalExaminationVisible(false);
        }}>修改</Button>
        let arrEdit = [editBtn];
        let arrAdd = [addBtn];
        if (mode == "edit") {
            return arrEdit
        }
        if (mode == "add") {
            return arrAdd
        }

        return arrAdd;
    }
    return (<div>
        {renderAgreementModal()}
    </div>
    );
};

export default RiskNotificationForm;