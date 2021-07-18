import React, { useEffect, useState } from 'react';
import {
    Button, Card, Col,
    Form, List, Row,
    Select, Tag, Table,
    Radio, Input, DatePicker,
    Modal, InputNumber, Tabs
} from 'antd';
import { dataSource, columns } from './data';
import './index.less';
const { TabPane } = Tabs;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const validateMessages = {
    required: '${label} is required!',
};
const Archives = (props) => {
    const [modalVisible, setModalVisible] = useState(false);//基本信息
    const [modalVisibleArchives, setModalVisibleArchives] = useState(false);//体检档案信息弹窗
    // 搜索部分
    const renderSearch = () => {
        return (
            <div>
                <Form onFinish={() => { }}  {...layout}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: 'center',
                        flexDirection: "row",
                        width: 1200,
                        marginTop: 15
                    }}>
                    <Form.Item label="姓名" name={"name"}>
                        <Input width="200" />
                    </Form.Item>
                    <Form.Item label="身份证号" name={"name"}>
                        <Input width="200" />
                    </Form.Item>
                    <Form.Item label="入院日期" name={"name"}>
                        <DatePicker width="200" />
                    </Form.Item>
                    <Button type="primary" size={'small'}>
                        查询
                  </Button>
                    <Button type="primary" size={'small'} onClick={() => { setModalVisible(true) }}>
                        新增
                  </Button>
                </Form>
            </div>
        )
    }
    //操作
    const editButton = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button size={'small'} type="primary" onClick={() => { setModalVisibleArchives(true) }}>体检报告</Button>
                <Button size={'small'} type="primary">入住评估</Button>
                <Button size={'small'} type="primary">试用期评估</Button>
                <Button size={'small'} type="primary">合同</Button>
                <Button size={'small'} type="primary">风险告知书</Button>
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
            title="老人档案"
            visible={modalVisible}
            onOk={() => { setModalVisible(false) }}
            onCancel={() => { setModalVisible(false) }}>
            <>
                <Card title="基本信息" style={{ width: "80%" }}>
                    <Form {...layout} name="nest-messages" validateMessages={validateMessages}>
                        <Form.Item
                            name={'name'}
                            label="姓名"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={'sex'}
                            label="性别"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Radio.Group onChange={() => { }} defaultValue={1}>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name={'age'}
                            label="年龄"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name={'careLevel'} label="级别护理">
                            <Select defaultValue="A" onChange={() => { }}>
                                <Option value="A">可以自理</Option>
                                <Option value="B">需要照顾</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name={'diagnosis'} label='入院诊断'>
                            <Select
                                mode="multiple"
                                defaultValue={["A", "B"]}
                                onChange={() => { }}>
                                <Option value="A">高血压</Option>
                                <Option value="B">糖尿病</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name={'inTime'} label="入院时间">
                            <DatePicker style={{ width: 267 }} />
                        </Form.Item>
                        <Form.Item name={'allergy'} label="过敏史">
                            <Select
                                mode="multiple"
                                defaultValue={["A", "B"]}
                                onChange={() => { }}>
                                <Option value="A">青霉素过敏</Option>
                                <Option value="B">鸡蛋白过敏    </Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name={'pastHistory'} label="既往史">
                            <Select
                                mode="multiple"
                                defaultValue={["A", "B"]}
                                onChange={() => { }}>
                                <Option value="A">高血压</Option>
                                <Option value="B">糖尿病</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name={'idCard'} label="身份证号">
                            <Input />
                        </Form.Item>
                        <Form.Item name={'contacts'} label="联系人姓名">
                            <Input />
                        </Form.Item>
                        <Form.Item name={'relationship'} label="关系">
                            <Select
                                mode="multiple"
                                defaultValue={["A", "B"]}
                                onChange={() => { }}>
                                <Option value="A">儿子</Option>
                                <Option value="B">女儿</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name={'contactsPhone'} label="联系电话">
                            <Input />
                        </Form.Item>
                        <Form.Item name={'address'} label="家庭住址">
                            <Input.TextArea />
                        </Form.Item>
                        {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        </Form.Item> */}
                    </Form>
                </Card>
            </>
        </Modal>
    }
    //体检弹窗
    const renderArchivesModal = () => {
        return <Modal
            title="体检信息"
            width={650}
            visible={modalVisibleArchives}
            onOk={() => { setModalVisibleArchives(false) }}
            onCancel={() => { setModalVisibleArchives(false) }}>
            <Form {...layout} name="nest-messages" validateMessages={validateMessages}>
                <Tabs defaultActiveKey="1" onChange={() => { }}>
                    <TabPane tab="基本信息" key="1">
                        <Card title="基本信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="姓名"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'sex'}
                                label="性别"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Radio.Group onChange={() => { }} defaultValue={1}>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={2}>女</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                name={'age'}
                                label="年龄"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name={'contactsPhone'} label="联系电话">
                                <Input />
                            </Form.Item>
                            <Form.Item name={'educationLevel'} label="文化程度">
                                <Input />
                            </Form.Item>
                            <Form.Item name={'pastHistory'} label="既往史">
                                <Select
                                    mode="multiple"
                                    defaultValue={["A", "B"]}
                                    onChange={() => { }}>
                                    <Option value="A">高血压</Option>
                                    <Option value="B">糖尿病</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="医生建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                    <TabPane tab="眼科" key="2">
                        <Card title="眼科信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="裸眼视力左"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="裸眼视力右"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="矫正视力左"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="矫正视力右"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="色觉"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">不正常</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="色调"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">单色能辨</Option>
                                    <Option value="B">单色不能辨</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="其他"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="检查医生"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">张三</Option>
                                    <Option value="B">李四</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="医生建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                    <TabPane tab="五官科" key="3">
                        <Card title="五官科信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="听力左"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="听力右"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="耳疾"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="嗅觉"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="口吃"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="颜面部"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="其他"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="检查医生"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">张三</Option>
                                    <Option value="B">李四</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="医生建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                    <TabPane tab="内科" key="4">
                        <Card title="内科科信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="心率"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="血压"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="发育及营养状况"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">良好</Option>
                                    <Option value="B">一般</Option>
                                    <Option value="C">差</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="心血管"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="神经及精神"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="肺及呼吸道"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="肝"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="脾"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="其他"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="检查医生"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">张三</Option>
                                    <Option value="B">李四</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="医生建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                    <TabPane tab="外科" key="5">
                        <Card title="外科信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="身长"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="体重"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="皮肤"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="四肢"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="淋巴"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="关节"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="脊柱"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="甲状腺"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">其他</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="其他"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="检查医生"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">张三</Option>
                                    <Option value="B">李四</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="医生建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                    <TabPane tab="化验检查" key="6">
                        <Card title="化验检查信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="血常规"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">异常</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="肝肾功能"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">异常</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="尿常规"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">异常</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="其他"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="检查医生"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">张三</Option>
                                    <Option value="B">李四</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="医生建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                    <TabPane tab="胸部透视" key="7">
                        <Card title="胸部科信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="心肺正常"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">正常</Option>
                                    <Option value="B">异常</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="其他"
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="医生建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                    <TabPane tab="体检结论建议" key="8">
                        <Card title="体检结论信息" style={{ width: 400 }}>
                            <Form.Item
                                name={'name'}
                                label="检查医生"
                            >
                                <Select
                                    defaultValue={["A"]}
                                    onChange={() => { }}>
                                    <Option value="A">张三</Option>
                                    <Option value="B">李四</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="检查时间"
                            >
                                <DatePicker style={{ width: 267 }} />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="总检结果"
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="总检建议"
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name={'name'}
                                label="备注"
                            >
                                <Input.TextArea />
                            </Form.Item>
                        </Card>
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
    }
    return (
        <div class="archives">
            <div class="content">
                {renderSearch()}
                {renderForm()}
                {renderMoadl()}
                {renderArchivesModal()}
            </div>
        </div>
    )
};

export default Archives