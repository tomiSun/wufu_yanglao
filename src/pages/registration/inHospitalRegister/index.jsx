import './index.less';
import React, { useEffect, useState } from 'react';
import {
    Button, Card, Col,
    Form, List, Row,
    Select, Tag, Table,
    Radio, Input, DatePicker,
    Modal, InputNumber, Tabs, message
} from 'antd';
import { columns } from './data';
import PhysicalExamination from '../compoment/PhysicalExamination';
import ProbationEvaluation from '../compoment/ProbationEvaluation';
import Assessment from '../compoment/Assessment';
import AgreementForm from '../compoment/AgreementForm';
import RiskNotificationForm from '../compoment/RiskNotificationForm';
import {
    addHospitalRegist,
    queryHospitalRegist,
    outHospitalRegist,
    updateHospitalRegist
} from '@/services/inHospitalRegister';
import { dictDateSelect } from '@/services/basicSetting/dictionary'
import moment from 'moment';
const { TabPane } = Tabs;
const layout = (x, y, labelAlign, layout) => {
    return {
        labelCol: { span: x },
        wrapperCol: { span: y },
        labelAlign,
        layout,
    }
};
const validateMessages = {
    required: '${label} is required!',
};
const InHospitalRegister = (props) => {
    const [registForm] = Form.useForm();
    const [SForm] = Form.useForm();
    const [dataSource, setDataSource] = useState([{1:1}]);
    const [modalVisible, setModalVisible] = useState(false);//基本信息
    const [dictionaryMap, setDictionaryMap] = useState({ "0008": [], "0009": [], "0010": [], "0011": [] })
    const [selectData, setSelectData] = useState([])
    const [physicalExaminationVisible, setPhysicalExaminationVisible] = useState(false);//体检的弹窗
    const [probationEvaluationVisible, setProbationEvaluationVisible] = useState(false);//试用期评估
    const [assessmentVisible, setAssessmentVisible] = useState(false);//入院评估
    const [agreementFormVisible, setAgreementFormVisible] = useState(false);//合同
    const [riskNotificationFormVisible, setRiskNotificationFormVisible] = useState(false);//分险告知书
    const [selectRowData, setSelectRowData] = useState([]);//选择的行
    const [mode, setMode] = useState("add")
    useEffect(() => {
        let param = { pageNum: 1, pageSize: 1000 }
        getHospitalRegistList(param);
        //获取字典
        getDictDataSelect(["0008", "0009", "0010", "0011"]);//过敏史
    }, []);

    //获取列表信息
    const getHospitalRegistList = async (param) => {
        let res = await queryHospitalRegist(param);
        setDataSource(res['data']['list'])
    }

    //获取信息
    const refushList = () => {
        let data = SForm.getFieldsValue();
        let param = {
            ...data, pageNum: 1, pageSize: 1000, status: 0
        }
        getHospitalRegistList(param);
    }

    //获取字典
    const getDictDataSelect = async (dList) => {
        let resMap = {}
        for (const [idx, it] of dList.entries()) {
            let param = { pageNum: 1, pageSize: 20, typeCode: String(it) }
            const res = await dictDateSelect(param);
            let key = param['typeCode']
            resMap[key] = res['data']['list']
            if (idx == dList.length - 1) {
                setDictionaryMap(resMap)
            }
        }
    }
    // 搜索部分
    const renderSearch = () => {
        return (
            <div>
                <Form onFinish={() => { }}  {...layout(8, 16, "left", "inline")}
                    form={SForm}
                >
                    <Form.Item label="姓名" name={"name"}>
                        <Input size={'small'} />
                    </Form.Item>
                    <Form.Item label="住院号" name={"businessNo"}>
                        <Input size={'small'} />
                    </Form.Item>
                    {/* <Form.Item label="入院日期" name={"name"}>
                        <DatePicker size={'small'} />
                    </Form.Item> */}
                    <Form.Item >
                        <Button type="primary" size={'small'} onClick={() => { refushList() }}>
                            查询
                        </Button>
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" size={'small'} onClick={() => {
                            setMode("add")
                            setModalVisible(true)
                        }}>
                            新增
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
    // 处理编辑基本信息
    const handleEdit = (row) => {
        setSelectData(row);
        setMode("edit");
        let data = { ...row, admissionTime: moment(row['admissionTime'] || new Date()) };
        registForm.setFieldsValue(data);
        setModalVisible(true)
    }
    //退院
    const handleOutHospitalRegist = async (row) => {
        let res = await outHospitalRegist({ businessNo: row['businessNo'] });
        message.success("退院成功")
        refushList()
    }
    //操作
    const editButton = (row) => {
        return (
            <div >
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => {
                        handleEdit(row)
                    }}>编辑</Button>
                <Button
                    style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => { setPhysicalExaminationVisible(true) }}>体检报告</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => { setAssessmentVisible(true) }}>入住评估</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => { setProbationEvaluationVisible(true) }}>试用期评估</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => { setAgreementFormVisible(true) }}>合同</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => { setRiskNotificationFormVisible(true) }}>风险告知书</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link"
                    onClick={() => { handleOutHospitalRegist(row) }}
                >办理出院</Button>
            </div>
        )
    }
    //表单
    const renderForm = () => {
        return (
            <div><Table columns={columns(editButton)} dataSource={dataSource} /></div>
        )
    }
    //弹窗
    const renderMoadl = () => {
        return <Modal
            title="入院登记"
            visible={modalVisible}
            onOk={() => { setModalVisible(false) }}
            onCancel={() => { setModalVisible(false) }}
            footer={renderBtnArea()}
        >
            <>
                <Card title="基本信息" style={{ width: "80%" }}>
                    <Form {...layout(8, 16)}
                        form={registForm}
                        name="nest-messages"
                        validateMessages={validateMessages}
                    >
                        <Form.Item
                            name={'name'}
                            label="姓名"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={'sex'}
                            label="性别"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group defaultValue={'1'}>
                                <Radio value={'1'}>男</Radio>
                                <Radio value={'2'}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name={'age'}
                            label="年龄"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name={'nursingLevel'} label="级别护理">
                            <Select defaultValue="0001" onChange={() => { }}>
                                {dictionaryMap?.["0011"].map(item => {
                                    return <Option value={item['dictCode']}>{item['dictName']}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name={'hospitalDiagnosis'} label='入院诊断'>
                            <Input />
                        </Form.Item>
                        <Form.Item name={'admissionTime'} label="入院时间">
                            <DatePicker style={{ width: 267 }} />
                        </Form.Item>
                        <Form.Item name={'allergy'} label="过敏史">
                            <Select
                                mode="multiple"
                                defaultValue={["0001", "0002"]}
                                onChange={() => { }}>
                                {dictionaryMap?.["0008"].map(item => {
                                    return <Option value={item['dictCode']}>{item['dictName']}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name={'pastHistory'} label="既往史">
                            <Select
                                mode="multiple"
                                defaultValue={["0001", "0002"]}
                                onChange={() => { }}>
                                {dictionaryMap?.["0009"].map(item => {
                                    return <Option value={item['dictCode']}>{item['dictName']}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name={'idCard'} label="身份证号">
                            <Input />
                        </Form.Item>
                        <Form.Item name={'relationName'} label="联系人姓名">
                            <Input />
                        </Form.Item>
                        <Form.Item name={'relation'} label="关系">
                            <Select
                                defaultValue={"0001"}
                                onChange={() => { }}>
                                {dictionaryMap?.["0010"].map(item => {
                                    return <Option value={item['dictCode']}>{item['dictName']}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name={'contactNumber'} label="联系电话">
                            <Input />
                        </Form.Item>
                        <Form.Item name={'contactAddress'} label="家庭住址">
                            <Input.TextArea />
                        </Form.Item>
                    </Form>
                </Card>
            </>
        </Modal>
    }
    const renderBtnArea = () => {
        //新增按钮
        let addBtn = <Button onClick={async () => {
            let addParam = { ...registForm.getFieldsValue(), aichiveId: "476794627073118208", status: 0 }
            let res = await addHospitalRegist(addParam)
            refushList()
            setModalVisible(false)
        }}>保存</Button>;
        //编辑按钮
        let editBtn = <Button onClick={async () => {
            let updateParam = { ...registForm.getFieldsValue(), aichiveId: "476794627073118208", id: selectData['id'] }
            let res = await updateHospitalRegist(updateParam)
            refushList()
            setModalVisible(false)
        }}> 修改</Button>
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
    return (
        <div class="archives">
            <div class="content">
                {renderSearch()}
                {renderForm()}
                {renderMoadl()}
                {/* 体检*/}
                {physicalExaminationVisible && <PhysicalExamination
                    visible={physicalExaminationVisible}
                    onPhysicalExaminationVisible={(flag) => {
                        setPhysicalExaminationVisible(flag)
                    }}
                    selectRowData={selectRowData}
                />}
                {/* 试用期评估*/}
                {probationEvaluationVisible && <ProbationEvaluation
                    visible={probationEvaluationVisible}
                    onProbationEvaluationVisible={(flag) => {
                        setProbationEvaluationVisible(flag)
                    }}
                    selectRowData={selectRowData}
                />}
                {/* 试用期评估*/}
                {assessmentVisible && <Assessment
                    visible={assessmentVisible}
                    onAssessmentVisible={(flag) => {
                        setAssessmentVisible(flag)
                    }}
                    selectRowData={selectRowData}
                />}
                {/* 合同 */}
                {agreementFormVisible && <AgreementForm
                    visible={agreementFormVisible}
                    onAgreementFormVisibleVisible={(flag) => {
                        setAgreementFormVisible(flag)
                    }}
                    selectRowData={selectRowData}
                />}
                {/* 风险告知书 */}
                {riskNotificationFormVisible && <RiskNotificationForm
                    visible={riskNotificationFormVisible}
                    onRiskNotificationFormVisible={(flag) => {
                        setRiskNotificationFormVisible(flag)
                    }}
                    selectRowData={selectRowData}
                />}
            </div>
        </div>
    )
};

export default InHospitalRegister