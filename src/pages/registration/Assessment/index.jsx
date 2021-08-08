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
} from 'antd';
import {
    assessmentDel,
    assessmentQuery,
    assessmentUpdate,
    assessmentSave
} from '@/services/inHospitalRegister/index.js';

// import { hearInfo } form './data'
let info1 = { "archiveId": "457947338305048576", "businessNo": "202107201654" }
let info2 = { "archiveId": "465188927389700096", "businessNo": "77" }
let record = info1
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
        //"465188927389700096" 
        hearingForm.setFieldsValue(record)
        let resQuery = await assessmentQuery({ "businessNo": record['businessNo'] })
        if (resQuery['code'] == 200 && !!resQuery['data']) {
            let id = resQuery['data']['id']
            setUpdateId(id)
            setMode("edit")
        } else {
            setMode("add")
        }
    }
    //听力
    const hearInfo = {
        title: "听力判断",
        extra: "评判标准：清楚：<5分；困难：5～10分；完全听不到：>10分",
        form: visualForm,
        judge: [5, 10],
        judgeString: ["清楚", "困难", "完全听不到"],
        data: {
            score: "visionScore",
            degree: "visionDegree",
            items: 'visionItems',
            list: [{
                name: "在大会集中听讲",
                point: "0",
                plainOptions: ['清楚0分', '困难1分', '听不到2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "在小组中听讲",
                point: "0",
                plainOptions: ['清楚0分', '困难1分', '听不到2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "面对面交谈",
                point: "0",
                plainOptions: ['清楚0分', '困难1分', '听不到2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "听电话",
                point: "0",
                plainOptions: ['清楚0分', '困难1分', '听不到2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "听收音机/电视",
                point: "0",
                plainOptions: ['清楚0分', '困难1分', '听不到2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "听广播/铃声/警号",
                point: "0",
                plainOptions: ['清楚0分', '困难1分', '听不到2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "使用助听器",
                point: "0",
                plainOptions: ['无0分', '有5分'],
                onChange: (data) => { console.log(data) }
            },
            ]
        }
    }
    //视力
    const visualInfo = {
        title: "视力判断",
        extra: "评判标准：清楚：<4分； 部分清楚：4～8分；完全看不见：>8分",
        form: hearingForm,
        judge: [4, 8],
        judgeString: ["清楚", "部分清楚", "完全看不见"],
        data: {
            score: "hearingScore",
            degree: "hearingDegree",
            items: 'hearingItems',
            list: [{
                name: "物件（衣服、扣针、发夹）",
                point: "0",
                plainOptions: ['清楚0分', '部分1分', '失明2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "家具（桌、椅）",
                point: "0",
                plainOptions: ['清楚0分', '部分1分', '失明2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "图形（圆形、三角形、正方形）",
                point: "0",
                plainOptions: ['清楚0分', '部分1分', '失明2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "颜色（红色、绿色、蓝色）",
                point: "0",
                plainOptions: ['清楚0分', '部分1分', '失明2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "佩戴辅助器",
                point: "0",
                plainOptions: ['无0分', '有4分'],
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
            list: [{
                name: "营养状况",
                point: "0",
                plainOptions: ['良好0分', '一般1分', '差2分', '极坏3分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "精神状况",
                point: "0",
                plainOptions: ['清晰0分', '冷漠1分', '混乱2分', '无意识3分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "活动能力",
                point: "0",
                plainOptions: ['自如0分', '协助1分', '只能坐2分', '卧床3分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "移动能力",
                point: "0",
                plainOptions: ['独立0分', '轻度限制1分', '很大限制2分', '不能动3分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "失禁",
                point: "0",
                plainOptions: ['无0分', '偶尔1分', '经常2分', '完全失禁3分'],
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
            list: [{
                name: "进食或饮水",
                point: "0",
                plainOptions: ['正常0分', '快或慢1分', '呛咳2分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "咀嚼",
                point: "0",
                plainOptions: ['正常0分', '不咀嚼1分', '直接吞食2分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "口腔情况",
                point: "0",
                plainOptions: ['正常0分', '佩戴义齿2分', '口腔疾患2分', '缺齿、无牙2分'],
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
            list: [{
                name: "语速",
                point: "0",
                plainOptions: ['正常0分', '快速1分', '迟缓2分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "音量",
                point: "0",
                plainOptions: ['正常0分', '响亮1分', '柔弱2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "音调",
                point: "0",
                plainOptions: ['清楚0分', '沙哑1分', '喘音2分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "表达方式",
                point: "0",
                plainOptions: ['完整句子0分', '简单句子1分', '说话断续2分', '单子3分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "内容",
                point: "0",
                plainOptions: ['清晰到题0分', '重复说话2分', '言语混乱3分', '重复无意义4分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "物件",
                point: "0",
                plainOptions: ['正常0分', '错误使用1分', '不能辨认2分'],
                onChange: (data) => { console.log(data) }
            }]
        }
    }
    //跌倒
    const fallFInfo = {
        title: "跌倒风险",
        extra: "评判标准：低风险：<1分；中度风险：1～3分；高度风险：>3分",
        form: hearingForm,
        judge: [1, 3],
        judgeString: ["低风险", "中度风险", "高度风险"],
        data: {
            score: "fallcore",
            degree: "fallDegree",
            items: 'fallItems',
            list: [{
                name: "有无跌倒史",
                point: "0",
                plainOptions: ['无0分', '有1分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "意识状态",
                point: "0",
                plainOptions: ['清醒或深昏迷0分', '有意识障碍1分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "行动能力",
                point: "0",
                plainOptions: ['稳定自主或完全不能移动0分', '无法稳定行走1分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "睡眠状态",
                point: "0",
                plainOptions: ['正常0分', '睡眠障碍或使用镇静催眠药1分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "有无体位性低血压",
                point: "0",
                plainOptions: ['无0分', '有1分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "排尿排便需他人协助",
                point: "0",
                plainOptions: ['不需要0分', '需1分'],
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
            list: [{
                name: "自杀史",
                point: "0",
                plainOptions: ['无0分', '有4分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "自杀高危因素（伴有精神障碍、财政、丧偶）",
                point: "0",
                plainOptions: ['无0分', '有1分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "自杀微兆（语言表示、自杀准备等）",
                point: "0",
                plainOptions: ['无0分', '有4分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "其他",
                point: "0",
                plainOptions: ['不存在自杀0分', '觉得生存没有价值1分', '有致死的念头2分'],
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
            list: [{
                name: "出走史",
                point: "0",
                plainOptions: ['无0分', '有4分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "出走念头",
                point: "0",
                plainOptions: ['无0分', '有2分'],
                onChange: (data) => { console.log(data) }
            },
            {
                name: "有严重出走行为",
                point: "0",
                plainOptions: ['无0分', '有4分'],
                onChange: (data) => { console.log(data) }
            }, {
                name: "出走危险因素（不安心养老、想念亲人等）",
                point: "0",
                plainOptions: ['无0分', '有2分'],
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
    const handleAssessmentChange = (e, item, info) => {
        let data = JSON.parse(JSON.stringify(info.form.getFieldsValue()));
        let arr = Object.values(data).map(it => {
            it = String(it).replace("部分", "")
            let indexNum = String(it).indexOf("分") - 1
            if (!isNumber(indexNum)) {
                return 0
            }
            let res = String(it).substring(String(it).indexOf("分") - 1, String(it).indexOf("分")) || 0
            return res
        })
        let total = arr.reduce((total, num) => { return total + Number(num) }, 0);
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
        let itemRes = itemarr.map(it => {
            let res = String(it[1]).substring(String(it[1]).indexOf("分") - 1, String(it[1]).indexOf("分")) || 0
            return {
                "name": it[0],
                "point": res
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
        const { score, degree, items, list } = data;
        return (<Card title={title} extra={<h4>{extra}</h4>}>
            <Form
                form={form}
                name="nest-messages" validateMessages={validateMessages}>
                {list.map((item, index) => {
                    return <>
                        <Form.Item name={`${items}${index}`} label={item["name"]} {...layout}>
                            <Radio.Group options={item['plainOptions']} onChange={(e) => {
                                handleAssessmentChange(e, item, info)
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
                style={{ height: 700 }}
            >
                {renderBasicCard(hearInfo)}
                {renderBasicCard(visualInfo)}
                {renderBasicCard(pressureInfo)}
                {renderBasicCard(chokingInfo)}
                {renderBasicCard(communicateInfo)}
                {renderBasicCard(fallFInfo)}
                {renderBasicCard(commitSuicideInfo)}
                {renderBasicCard(leaveInfo)}
            </Modal >
        )
    }
    const renderBtnArea = () => {
        //新增按钮
        let addBtn = <Button
            type={"primary"}
            onClick={async () => {
                let addParam = {
                    businessNo: record['businessNo'],
                    archiveId: record['archiveId'],
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
                console.log("AAA", JSON.stringify(addParam))
            }}>新增</Button>;
        //删除按钮
        let delBtn = <Button onClick={async () => {
            let res1 = await assessmentDel({ "businessNo": record['businessNo'] })
        }}>删除</Button>
        //编辑按钮
        let editBtn = <Button
            type={"primary"}
            onClick={async () => {
                let updateParam = {
                    id: updateId,
                    businessNo: record['businessNo'],
                    archiveId: record['archiveId'],
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