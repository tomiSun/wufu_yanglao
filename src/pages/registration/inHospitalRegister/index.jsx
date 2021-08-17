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
import { BedTreeSelect } from '@/components/BedTreeSelect'
import PhysicalExamination from '../compoment/PhysicalExamination';
import ProbationEvaluation from '../compoment/ProbationEvaluation';
import Assessment from '../compoment/Assessment';
import AgreementForm from '../compoment/AgreementForm';
import RiskNotificationForm from '../compoment/RiskNotificationForm';
//登记接口
import {
    addHospitalRegist,
    queryHospitalRegist,
    outHospitalRegist,
    updateHospitalRegist,
    patientQuery
} from '@/services/inHospitalRegister';
//床位信息接口
import {
    bedQuery,
} from '@/services/basicSetting/bedInfo';
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
    const [registOutForm] = Form.useForm();
    const [SForm] = Form.useForm();
    const [dataSource, setDataSource] = useState([{ 1: 1 }]);
    const [modalVisible, setModalVisible] = useState(false);//基本信息
    const [modalOutVisible, setModalOutVisible] = useState(false);//出院办理
    const [dictionaryMap, setDictionaryMap] = useState({ "0008": [], "0009": [], "0010": [], "0011": [] })
    const [selectData, setSelectData] = useState([])
    const [physicalExaminationVisible, setPhysicalExaminationVisible] = useState(false);//体检的弹窗
    const [probationEvaluationVisible, setProbationEvaluationVisible] = useState(false);//试用期评估
    const [assessmentVisible, setAssessmentVisible] = useState(false);//入院评估
    const [agreementFormVisible, setAgreementFormVisible] = useState(false);//合同
    const [riskNotificationFormVisible, setRiskNotificationFormVisible] = useState(false);//分险告知书
    const [selectRowData, setSelectRowData] = useState([]);//选择的行
    const [bedList, setBedList] = useState([]);//床位号
    const [roomInfo, setRoomInfo] = useState();//房间信息
    const [nameSelectList, setNameSelectList] = useState([]);//复合搜索的人的集合
    const [nameSelectData, setNameSelectData] = useState([]);//选中的人员信息
    const [mode, setMode] = useState("add")
    useEffect(() => {
        //获取字典
        getDictDataSelect(["0008", "0009", "0010", "0011"]);//过敏史
    }, []);

    useEffect(() => {
        let param = { pageNum: 1, pageSize: 1000 }
        getHospitalRegistList(param);
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
            ...data, pageNum: 1, pageSize: 1000, status: "0"
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
        let data = {
            ...row, admissionTime: moment(row['admissionTime'] || new Date()),
            feesDueDate: moment(row['feesDueDate'] || new Date())
        };
        registForm.setFieldsValue(data);
        setModalVisible(true)
    }
    //退院
    const handleOutHospitalRegist = async (row) => {
        let res = await outHospitalRegist({ businessNo: row['businessNo'], peopleTo: registOutForm.getFieldsValue().peopleTo });

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
                    size={'small'} type="link" onClick={() => {
                        setSelectRowData(row)
                        setPhysicalExaminationVisible(true)
                    }}>体检报告</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => {
                        setSelectRowData(row)
                        setAssessmentVisible(true)
                    }}>入住评估</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => {
                        setSelectRowData(row)
                        setProbationEvaluationVisible(true)
                    }}>试用期评估</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => {
                        setSelectRowData(row)
                        setAgreementFormVisible(true)
                    }}>合同</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'} type="link" onClick={() => {
                        setSelectRowData(row)
                        setRiskNotificationFormVisible(true)
                    }}>风险告知书</Button>
                <Button style={{ marginRight: 10 }}
                    size={'small'}
                    type={'link'}
                    onClick={() => {
                        setSelectRowData(row)
                        setModalOutVisible(true);
                        registOutForm.setFieldsValue({ peopleTo: "1" })
                    }
                    }
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
    //处理房间号的变更
    const handleRoomChange = async (value, v2) => {
        //bedRoomQuery,
        let res = await bedQuery({ pageNum: 1, pageSize: 10, id: value, keyWords: "" })
        setBedList(res['data']['list'])
        registForm.setFieldsValue({ bedCode: "" })
    }
    //姓名搜索框
    const nameSelectChange = async (value) => {
        let res = await patientQuery({ keyWords: value });
        console.log(res)

    }
    //姓名搜索框
    const nameSelectBlur = async (e, data) => {
        let res = await patientQuery({ keyWords: e });
        setNameSelectList(res['data'])
    }
    //弹窗
    const renderMoadl = () => {
        return <Modal
            title="入院登记"
            visible={modalVisible}
            onOk={() => { setModalVisible(false) }}
            onCancel={() => { setModalVisible(false) }}
            style={{ width: 500 }}
            footer={renderBtnArea()}
        >
            <>
                <Form {...layout(8, 16)}
                    form={registForm}
                    name="nest-messages"
                    validateMessages={validateMessages}
                    style={{ marginRight: 60, marginTop: 20 }}
                >
                    <Form.Item
                        name={'name'}
                        label="姓名"
                        rules={[{ required: true }]}
                    >
                        <Select
                            showSearch
                            placeholder="姓名"
                            onSearch={nameSelectBlur}
                        >
                            {nameSelectList.map(item => {
                                return <Option value={item["archiveId"]}>{item['name']}</Option>
                            })}
                        </Select>
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
                    <Form.Item
                        name={'roomCode'}
                        label="房间号"
                        treeDefaultExpandAll={true}
                    >
                        <BedTreeSelect onSelect={handleRoomChange} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name={'peopleFrom'}
                        label="来源"
                    >
                        <Select
                            onChange={(value, record) => {
                                setRoomInfo(record['data'])
                            }}
                            defaultValue={"1"}
                        >
                            {[{ name: "社会", value: "1" }, { name: "医院", value: "2" }].map(item => {
                                return <Option value={item['value']} data={item}>{item['name']}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={'bedCode'}
                        label="床位号"
                    >
                        <Select
                            onChange={(value, record) => {
                                setRoomInfo(record['data'])
                            }}>
                            {bedList.map(item => {
                                return <Option value={item['bedCode']} data={item}>{item['name']}</Option>
                            })}
                        </Select>
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
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={'feesDueDate'} label="费用到期时间">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={'allergy'} label="过敏史">
                        <Select
                            mode="multiple"
                            // defaultValue={["0001", "0002"]}
                            onChange={() => { }}>
                            {dictionaryMap?.["0008"].map(item => {
                                return <Option value={item['dictName']}>{item['dictName']}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name={'previousHistory'} label="既往史">
                        <Select
                            mode="multiple"
                            // defaultValue={["0001", "0002"]}
                            onChange={() => { }}>
                            {dictionaryMap?.["0009"].map(item => {
                                return <Option value={item['dictName']}>{item['dictName']}</Option>
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
            </>
        </Modal>
    }
    const rendeOutrMoadl = () => {
        return <Modal
            title="出院登记"
            visible={modalOutVisible}
            onOk={() => { setModalOutVisible(false) }}
            onCancel={() => { setModalOutVisible(false) }}
            style={{ width: 500 }}
            footer={[<Button
                type="primary"
                onClick={() => {
                    handleOutHospitalRegist(selectRowData)
                }}>
                办理出院
            </Button>]}
        >
            <>
                <Form {...layout(8, 16)}
                    form={registOutForm}
                    name="nest-messages"
                    validateMessages={validateMessages}
                    style={{ marginRight: 60, marginTop: 20 }}
                >
                    <Form.Item
                        name={'peopleTo'}
                        label="流向"
                    >
                        <Select
                            onChange={(value, record) => {
                                setRoomInfo(record['data'])
                            }}
                            defaultValue={"1"}
                        >
                            {[{ name: "社会", value: "1" }, { name: "医院", value: "2" }].map(item => {
                                return <Option value={item['value']} data={item}>{item['name']}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
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
                {rendeOutrMoadl()}
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