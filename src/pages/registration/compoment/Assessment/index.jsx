/**试用期评估 */
import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    List,
    Row,
    Select,
    Tag,
    Table,
    Radio,
    Input,
    DatePicker,
    Modal,
    InputNumber,
    Tabs,
    Checkbox,
    message,
} from 'antd';
import {
    assessmentDel,
    assessmentQuery,
    assessmentUpdate,
    assessmentSave
} from '@/services/inHospitalRegister/index.js';

const { TabPane } = Tabs;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    // labelAlign: 'left',
    // layout: 'inline',
};
const validateMessages = {
    required: '${label} is required!',
};
const Assessment = (props) => {
    //属性
    const { selectRowData, onAssessmentVisible, visible } = props;
    const { archiveId } = selectRowData;
    //变量
    const [mode, setMode] = useState("add");//模式是新增还是编辑 
    //form
    const [hearingForm] = Form.useForm();//听力判断
    const [visualForm] = Form.useForm();//视力判断
    const [pressureSoreForm] = Form.useForm();//压疮判断
    const [chokingForm] = Form.useForm();//噎食判断
    const [communicateForm] = Form.useForm();//沟通 
    const [fallForm] = Form.useForm();//跌倒风险
    const [commitSuicideForm] = Form.useForm();//自杀风险
    const [leaveForm] = Form.useForm();//出走风险
    //更新时的ID
    const [updateId, setUpdateId] = useState("")
    useEffect(() => {
        initData()
    }, []);
    //初始化 判断是新增还是编辑
    const initData = async () => {
        let resQuery = await assessmentQuery({ "businessNo": selectRowData['businessNo'] })
        if (resQuery['code'] == 200 && !!resQuery['data']) {
            let id = resQuery['data']['id']
            debugger
            let item1 = formartItems(resQuery['data']['hearingItems'])
            debugger
            hearingForm.setFieldsValue({ ...resQuery['data'], ...item1 })
            visualForm.setFieldsValue(resQuery['data'])
            pressureSoreForm.setFieldsValue(resQuery['data'])
            chokingForm.setFieldsValue(resQuery['data'])
            communicateForm.setFieldsValue(resQuery['data'])
            fallForm.setFieldsValue(resQuery['data'])
            commitSuicideForm.setFieldsValue(resQuery['data'])
            leaveForm.setFieldsValue(resQuery['data'])
            setUpdateId(id)
            setMode("edit")
        } else {
            setMode("add")
        }
    }
    const formartItems = (arr) => {
        if (!arr || !arr.length > 0) {
            return {}
        }
        let res = {}
        arr.forEach(element => {
            res[element.name] = Number(element.point)
        });
        debugger
        return res
    }
    //听力
    const hearInfo = {
        title: "听力判断",
        extra: "评判标准：清楚：<5分；困难：5～10分；完全听不到：>10分",
        form: hearingForm,
        judge: [5, 10],
        judgeString: ["清楚", "困难", "完全听不到"],
        data: {
            score: "hearingScore",
            degree: "hearingDegree",
            items: 'hearingItems',
            key: "hearing",
            list: [{
                name: "在大会集中听讲",
                point: "0",
                plainOptions: [
                    { label: '清楚0分', value: 0 },
                    { label: '困难1分', value: 1 },
                    { label: '听不到2分', value: 2 }],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "在小组中听讲",
                point: "0",
                plainOptions: [
                    { label: '清楚0分', value: 0 },
                    { label: '困难1分', value: 1 },
                    { label: '听不到2分', value: 2 }],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "面对面交谈",
                point: "0",
                plainOptions: [
                    { label: '清楚0分', value: 0 },
                    { label: '困难1分', value: 1 },
                    { label: '听不到2分', value: 2 }],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "听电话",
                point: "0",
                plainOptions: [
                    { label: '清楚0分', value: 0 },
                    { label: '困难1分', value: 1 },
                    { label: '听不到2分', value: 2 }],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "听收音机/电视",
                point: "0",
                plainOptions: [
                    { label: '清楚0分', value: 0 },
                    { label: '困难1分', value: 1 },
                    { label: '听不到2分', value: 2 }],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "听广播/铃声/警号",
                point: "0",
                plainOptions: [
                    { label: '清楚0分', value: 0 },
                    { label: '困难1分', value: 1 },
                    { label: '听不到2分', value: 2 }],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "使用助听器",
                point: "0",
                plainOptions: [
                    { label: '无0分', value: 0 },
                    { label: '有5分', value: 5 },
                ],
                onChange: (data) => { console.log(data) }
            },
            ]
        }
    }
    //视力
    const visualInfo = {
        title: "视力判断",
        extra: "评判标准：清楚：<4分； 部分清楚：4～8分；完全看不见：>8分",
        form: visualForm,
        judge: [4, 8],
        judgeString: ["清楚", "部分清楚", "完全看不见"],
        data: {
            score: "visionScore",
            degree: "visionDegree",
            items: 'visionItems',
            key: 'vision',
            list: [{
                name: "物件（衣服、扣针、发夹）",
                point: "0",
                plainOptions: [{ label: '清楚0分', value: 0 },
                { label: '部分1分', value: 1 },
                { label: '失明2分', value: 2 }
                ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "家具（桌、椅）",
                point: "0",
                plainOptions:
                    [{ label: '清楚0分', value: 0 },
                    { label: '部分1分', value: 1 },
                    { label: '失明2分', value: 2 }
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "图形（圆形、三角形、正方形）",
                point: "0",
                plainOptions: [{ label: '清楚0分', value: 0 },
                { label: '部分1分', value: 1 },
                { label: '失明2分', value: 2 }
                ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "颜色（红色、绿色、蓝色）",
                point: "0",
                plainOptions: [{ label: '清楚0分', value: 0 },
                { label: '部分1分', value: 1 },
                { label: '失明2分', value: 2 }
                ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "佩戴辅助器",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有4分', value: 4 },],
                onChange: (data) => { console.log(data) }
            }]
        }
    }
    //压疮判断
    const pressureInfo = {
        title: "压疮风险",
        extra: "评判标准：低风险：<5分；中度风险：5～10分；高度风险：>10分",
        form: pressureSoreForm,
        judge: [5, 10],
        judgeString: ["低风险", "中度风险", "高度风险"],
        data: {
            score: "pressureSoresScore",
            degree: "pressureSoresDegree",
            items: 'pressureSoresItems',
            key: "pressureSores",
            list: [{
                name: "营养状况",
                point: "0",
                plainOptions:
                    [{ label: '良好0分', value: 0 },
                    { label: '一般1分', value: 1 },
                    { label: '差2分', value: 2 },
                    { label: '极坏3分', value: 3 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "精神状况",
                point: "0",
                plainOptions:
                    [{ label: '清晰0分', value: 0 },
                    { label: '冷漠1分', value: 1 },
                    { label: '混乱2分', value: 2 },
                    { label: '无意识3分', value: 3 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "活动能力",
                point: "0",
                plainOptions:
                    [{ label: '自如0分', value: 0 },
                    { label: '协助1分', value: 1 },
                    { label: '只能坐2分', value: 2 },
                    { label: '卧床3分', value: 3 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "移动能力",
                point: "0",
                plainOptions:
                    [{ label: '独立0分', value: 0 },
                    { label: '轻度限制1分', value: 1 },
                    { label: '很大限制2分', value: 2 },
                    { label: '不能动3分', value: 3 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "失禁",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '偶尔1分', value: 1 },
                    { label: '经常2分', value: 2 },
                    { label: '完全失禁3分', value: 3 },
                    ],
                onChange: (data) => { console.log(data) }
            }
            ]
        }
    }
    //噎食判断
    const chokingInfo = {
        title: "噎食风险",
        extra: "评判标准：无：<2分；有：>=2分",
        form: chokingForm,
        judge: [2],
        judgeString: ["无", "有"],
        data: {
            score: "chokeFeedScore",
            degree: "chokeFeedDegree",
            items: 'chokeFeedItems',
            key: "chokeFeed",
            list: [{
                name: "进食或饮水",
                point: "0",
                plainOptions:
                    [{ label: '正常0分', value: 0 },
                    { label: '快或慢1分', value: 1 },
                    { label: '呛咳2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "咀嚼",
                point: "0",
                plainOptions:
                    [{ label: '正常0分', value: 0 },
                    { label: '不咀嚼1分', value: 1 },
                    { label: '直接吞食2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "口腔情况",
                point: "0",
                plainOptions: [{ label: '正常0分', value: 0 },
                { label: '佩戴义齿2分', value: 2 },
                { label: '口腔疾患2分', value: 2 },
                { label: '缺齿、无牙2分', value: 2 },
                ],
                onChange: (data) => { console.log(data) }
            }]
        }
    }
    //沟通 
    const communicateInfo = {
        title: "沟通",
        extra: "评判标准：正常：<5分；沟通障碍：5～10分；完全不能沟通：>10分",
        form: communicateForm,
        judge: [5, 10],
        judgeString: ["正常", "沟通障碍", "完全不能沟通"],
        data: {
            score: "communicationScore",
            degree: "communicationDegree",
            items: 'communicationItems',
            key: "communication",
            list: [{
                name: "语速",
                point: "0",
                plainOptions:
                    [{ label: '正常0分', value: 0 },
                    { label: '快速1分', value: 1 },
                    { label: '迟缓2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "音量",
                point: "0",
                plainOptions:
                    [{ label: '正常0分', value: 0 },
                    { label: '响亮1分', value: 1 },
                    { label: '柔弱2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "音调",
                point: "0",
                plainOptions:
                    [{ label: '清楚0分', value: 0 },
                    { label: '沙哑1分', value: 1 },
                    { label: '喘音2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "表达方式",
                point: "0",
                plainOptions:
                    [{ label: '完整句子0分', value: 0 },
                    { label: '简单句子1分', value: 1 },
                    { label: '说话断续2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "内容",
                point: "0",
                plainOptions:
                    [{ label: '清晰到题0分', value: 0 },
                    { label: '重复说话2分', value: 2 },
                    { label: '言语混乱3分', value: 3 },
                    { label: '重复无意义4分', value: 4 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "物件",
                point: "0",
                plainOptions:
                    [{ label: '正常0分', value: 0 },
                    { label: '错误使用1分', value: 1 },
                    { label: '不能辨认2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            }]
        }
    }
    //跌倒
    const fallFInfo = {
        title: "跌倒风险",
        extra: "评判标准：低风险：<1分；中度风险：1～3分；高度风险：>3分",
        form: fallForm,
        judge: [1, 3],
        judgeString: ["低风险", "中度风险", "高度风险"],
        data: {
            score: "fallcore",
            degree: "fallDegree",
            items: 'fallItems',
            key: "fall",
            list: [{
                name: "有无跌倒史",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有1分', value: 1 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "意识状态",
                point: "0",
                plainOptions:
                    [{ label: '清醒或深昏迷0分', value: 0 },
                    { label: '有意识障碍1分', value: 1 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "行动能力",
                point: "0",
                plainOptions:
                    [{ label: '稳定自主或完全不能移动0分', value: 0 },
                    { label: '无法稳定行走1分', value: 1 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "睡眠状态",
                point: "0",
                plainOptions:
                    [{ label: '正常0分', value: 0 },
                    { label: '睡眠障碍或使用镇静催眠药1分', value: 1 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "有无体位性低血压",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有1分', value: 1 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "排尿排便需他人协助",
                point: "0",
                plainOptions:
                    [{ label: '不需要0分', value: 0 },
                    { label: '需1分', value: 1 },
                    ],
                onChange: (data) => { console.log(data) }
            }]
        }
    }
    //自杀
    const commitSuicideInfo = {
        title: "自杀风险",
        extra: "评判标准：低风险：<4分；中度风险：4～8分；高度风险：>8分",
        form: commitSuicideForm,
        judge: [4, 8],
        judgeString: ["低风险", "中度风险", "高度风险"],
        data: {
            score: "suicideScore",
            degree: "suicideDegree",
            items: 'suicideItems',
            key: "suicide",
            list: [{
                name: "自杀史",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有4分', value: 4 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "自杀高危因素（伴有精神障碍、财政、丧偶）",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有1分', value: 1 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "自杀微兆（语言表示、自杀准备等）",
                point: "0",
                plainOptions: [{ label: '无0分', value: 0 },
                { label: '有4分', value: 4 },
                ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "其他",
                point: "0",
                plainOptions:
                    [{ label: '不存在自杀0分', value: 0 },
                    { label: '觉得生存没有价值1分', value: 1 },
                    { label: '有致死的念头2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            }]
        }
    }
    //出走
    const leaveInfo = {
        title: "出走",
        extra: "评判标准：低风险：<3分；中度风险：3～8分；高度风险：>8分",
        form: leaveForm,
        judge: [3, 8],
        judgeString: ["低风险", "中度风险", "高度风险"],
        data: {
            score: "runAwayScore",
            degree: "runAwayDegree",
            items: 'runAwayItems',
            key: "runAway",
            list: [{
                name: "出走史",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有4分', value: 4 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "出走念头",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "有严重出走行为",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有4分', value: 4 },
                    ],
                onChange: (data) => { console.log(data) }
            }, {
                name: "出走危险因素（不安心养老、想念亲人等）",
                point: "0",
                plainOptions:
                    [{ label: '无0分', value: 0 },
                    { label: '有2分', value: 2 },
                    ],
                onChange: (data) => { console.log(data) }
            },
            ]
        }
    }
    const isNumber = (val) => {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }
    const handleAssessmentChange = (e, item, info, key) => {
        let data = JSON.parse(JSON.stringify(info.form.getFieldsValue()));
        let arr = Object.entries(data).filter((it, value) => {
            if (it[0] !== `${key}Score` && it[0] !== `${key}Degree` && it[0] !== `${key}Items`) {
                return it[1]
            }
        })
        let total = arr.reduce((total, num) => { return total + Number(num[1]) }, 0);
        const findDegree = (num, arr) => {
            if (arr.length > 1) {
                if (num < arr[0]) return 0;
                if (num > arr[2]) return 2;
                return 1
            }
            if (arr.length < 2) {
                if (num < arr[0]) return 0;
                return 1
            }
        }
        //给关键字赋值 key
        let score = info['data']['score'];
        let degree = info['data']['degree'];
        let items = info['data']['items'];
        //给关键字赋值 值
        let index = findDegree(total, info['judge'])
        let res = info['judgeString'][index]
        let itemarr = Object.entries(data).filter(its => {
            if (its[0].indexOf(items) > -1) return its
        })
        debugger
        let itemRes = itemarr.map(it => {
            return {
                "name": it[0],
                "point": it[1]
            }
        })
        let obj = {}
        obj[score] = total;
        obj[degree] = res;
        obj[items] = itemRes;
        info.form.setFieldsValue(obj)
    }
    const renderBasicCard = (info) => {
        const { title, extra, data, form } = info;
        const { score, degree, items, list, key } = data;
        return (<Card title={title} extra={<h4>{extra}</h4>}>
            <Form
                form={form}
                name="nest-messages" validateMessages={validateMessages}>
                {list.map((item, index) => {
                    return <>
                        <Form.Item name={`${items}${index}`} label={item["name"]} {...layout}>
                            <Radio.Group options={item['plainOptions']} onChange={(e) => {
                                handleAssessmentChange(e, item, info, key)
                            }} />
                        </Form.Item>
                    </>
                })}
                <Form.Item name={score} label="综合得分" {...layout}>
                    <Input style={{ width: 200 }} disabled />
                </Form.Item>
                <Form.Item name={degree} label="判定程度" {...layout}>
                    <Input style={{ width: 200 }} disabled />
                </Form.Item>
                <Form.Item name={items} label="000" {...layout} style={{ display: 'none' }}>
                    <Input style={{ width: 200 }} disabled />
                </Form.Item>
            </Form>
        </Card>)
    }
    //入院评估弹窗
    const renderAssessmentModal = () => {
        return (
            <Modal
                title="入院评估"
                width={850}
                visible={visible}
                footer={renderBtnArea()}
                onOk={() => {
                    onAssessmentVisible(false);
                }}
                onCancel={() => {
                    onAssessmentVisible(false);
                }}
                style={{ height: 800, marginTop: -70 }}
            >
                <div style={{ height: 700, overflow: "auto" }}>
                    {renderBasicCard(hearInfo)}
                    {renderBasicCard(visualInfo)}
                    {renderBasicCard(pressureInfo)}
                    {renderBasicCard(chokingInfo)}
                    {renderBasicCard(communicateInfo)}
                    {renderBasicCard(fallFInfo)}
                    {renderBasicCard(commitSuicideInfo)}
                    {renderBasicCard(leaveInfo)}
                </div>
            </Modal >
        )
    }
    const renderBtnArea = () => {
        //新增按钮
        let addBtn = <Button
            type={"primary"}
            onClick={async () => {
                let addParam = {
                    businessNo: selectRowData['businessNo'],
                    archiveId: selectRowData['archiveId'],
                    admissionTime: new Date(),
                    age: 18,
                    floorName: "1",
                    name: "李四",
                    sex: "男",
                    bedName: "101",
                    ...hearingForm.getFieldsValue(),
                    ...visualForm.getFieldsValue(),
                    ...pressureSoreForm.getFieldsValue(),
                    ...chokingForm.getFieldsValue(),
                    ...communicateForm.getFieldsValue(),
                    ...fallForm.getFieldsValue(),
                    ...commitSuicideForm.getFieldsValue(),
                    ...leaveForm.getFieldsValue()
                }
                let res3 = await assessmentSave(addParam)
                message.success("新增成功")
                onAssessmentVisible(false);
            }}>新增</Button>;
        //删除按钮
        let delBtn = <Button onClick={async () => {
            let res1 = await assessmentDel({ "businessNo": selectRowData['businessNo'] })
            message.success("删除成功")
            onAssessmentVisible(false);
        }}>删除</Button>
        //编辑按钮
        let editBtn = <Button
            type={"primary"}
            onClick={async () => {
                let updateParam = {
                    id: updateId,
                    businessNo: selectRowData['businessNo'],
                    archiveId: selectRowData['archiveId'],
                    admissionTime: new Date(),
                    age: 18,
                    floorName: "1",
                    name: "李四",
                    sex: "男",
                    bedName: "101",
                    ...hearingForm.getFieldsValue(),
                    ...visualForm.getFieldsValue(),
                    ...pressureSoreForm.getFieldsValue(),
                    ...chokingForm.getFieldsValue(),
                    ...communicateForm.getFieldsValue(),
                    ...fallForm.getFieldsValue(),
                    ...commitSuicideForm.getFieldsValue(),
                    ...leaveForm.getFieldsValue()
                }
                let res3 = await assessmentUpdate(updateParam)
                message.success("修改成功")
                onAssessmentVisible(false);
            }}>修改</Button>
        let arrEdit = [editBtn, delBtn];
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
        {renderAssessmentModal()}
    </div>
    );
};

export default Assessment;