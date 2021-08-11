import React, { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Row,
    Select,
    Table,
    Radio,
    Input,
    DatePicker,
    TimePicker,
    Tabs,
    Checkbox,
    Col
} from 'antd';
import { BedTreeSelect } from '@/components/BedTreeSelect'
import styles from './index.less';
import { columns, dataSource } from './config';
import { history, useLocation } from 'umi';
import { dictDateSelect } from '@/services/basicSetting/dictionary';
import {
    bloodSugarUpdate,
    bloodSugarInsert,
    updateSpecialNursing,
    addSpecialNursing
} from '@/services/nursingManagement';
let info1 = {
    "bedName": "1234",
    "businessNo": "111",
    "id": "475308651586916352",
    "patientName": "赵总"
}
let info2 = { "archiveId": "465188927389700096", "businessNo": "77" }
let record = info1
const { TabPane } = Tabs;
import { ULayout } from '@/utils/common'

const validateMessages = {
    required: '${label} 为必填项',
};
const NursingAddRecord = (props) => {
    const { query } = useLocation();
    const { selectKey, type } = query;
    //护理
    const [nursingForm] = Form.useForm();
    //血糖
    const [bloodForm] = Form.useForm();
    //特级护理
    const [specialNursingForm] = Form.useForm();
    //三测单
    const [threeVolumeForm] = Form.useForm();
    //tab页 key
    const [tabKey, setTabKey] = useState(selectKey || "1");
    //当前页面的状态
    const [ftype, setFtype] = useState(type)

    const [samplingStatusMap, setSamplingStatusMap] = useState([]);
    //获取字典
    useEffect(() => {
        getDictDataSelect({ pageNum: 1, pageSize: 20, typeCode: "0006" })
    }, []);
    // 搜索部分
    const renderSearch = () => {
        return (
            <Form onFinish={() => { }} {...ULayout(8, 16, 'left', 'inline')}>
                <Form.Item label="姓名" name={'name'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} />
                </Form.Item>
                <Form.Item label="住院编号" name={'id'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} />
                </Form.Item>
                <Form.Item label="床位号" name={'time'}>
                    <BedTreeSelect />
                </Form.Item>
                <Form.Item label="护理等级" name={'time'}>
                    <Select defaultValue={['A']} onChange={() => { }} style={{ width: 150 }} size={"small"}>
                        <Option value="A">一级</Option>
                        <Option value="B">特级</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" size={'small'}>
                        查询
                    </Button>
                </Form.Item>
            </Form>
        );
    };
    //人员信息
    const renderPeopleInfo = () => {
        return <Table columns={columns()} dataSource={dataSource} />
    }
    //获取字典
    const getDictDataSelect = async (param) => {
        let res = await dictDateSelect(param);
        setSamplingStatusMap(res['data']['list'])
    }
    //护理项目
    const renderNursingItem = () => {
        return (
            <Form onFinish={() => { }} {...ULayout(8, 16)} style={{ width: '80%' }} form={nursingForm}>
                <Form.Item label="日期" name={'a'} >
                    <DatePicker style={{ width: "100%" }} size={'small'} />
                </Form.Item>
                <Form.Item label="时间段" name={'b'}>
                    <Checkbox.Group size={'small'}>
                        <Row>
                            <Col span={5}>
                                <Checkbox value="A">早</Checkbox>
                            </Col>
                            <Col span={5}>
                                <Checkbox value="D">中</Checkbox>
                            </Col>
                            <Col span={6}>
                                <Checkbox value="B">晚</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="F">睡前</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item label="体温" name={'c'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="°C" />
                </Form.Item>
                <Form.Item label="脉搏心率" name={'d'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
                </Form.Item>
                <Form.Item label="R" name={'d'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
                </Form.Item>
                <Form.Item label="BP mmHg" name={'d'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} />
                </Form.Item>
                <Form.Item label="基础护理" name={'e'}>
                    <Checkbox.Group  >
                        <Row>
                            <Col span={8}>
                                <Checkbox value="A">洗头理发</Checkbox>
                            </Col>
                            <Col span={16}>
                                <Checkbox value="D">更换清晰晾晒衣被</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="B">修剪指甲</Checkbox>
                            </Col>
                            <Col span={16}>
                                <Checkbox value="F">清扫房间整理衣物</Checkbox>
                            </Col>
                            <Col span={8}>
                                <Checkbox value="C">清洗便器</Checkbox>
                            </Col>
                            <Col span={16}>
                                <Checkbox value="E">送开水打洗漱水</Checkbox>
                            </Col>
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item label="老人身心观察记录" name={'d'}>
                    <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={3} />
                </Form.Item>
                <Form.Item label="其他" name={'d'}>
                    <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={4} />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" size={'small'} style={{ position: "relative", right: 0 }}>
                            保存
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        );
    }
    //血糖
    const bloodGlucoseRecord = () => {
        return (
            <Form onFinish={() => { }} {...ULayout(8, 16)} style={{ width: '80%' }}
                form={bloodForm}>
                <Form.Item label="采样状态" name={'samplingStatus'}>
                    <Select style={{ width: "100%" }} defaultValue="0001">
                        {samplingStatusMap.map(item => {
                            return <Option value={item['dictCode']}>{item['dictName']}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="采样日期" name={'bloodSugarRecordDate'}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="采样时间" name={'samplingTime'}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="采样签名" name={'samplingSignature'}>
                    <Input size="small" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="血糖值(单位：mmol)" name={'bloodGlucoseValue'} >
                    <Input size="small" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="医院诊断" name={'hospitalDiagnosis'}>
                    <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={3} />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="primary"
                            size={'small'}
                            style={{ position: "relative", right: 0 }}
                            onClick={async () => {
                                if (ftype == "add") {
                                    let param = { ...bloodForm.getFieldsValue(), ...record }
                                    let res = await bloodSugarInsert(param)
                                }
                                if (ftype == "edit") {
                                    let param = { ...bloodForm.getFieldsValue(), ...record }
                                    let res = await bloodSugarUpdate(param)
                                }
                            }}
                        >
                            {ftype == "add" ? "保存" : "修改"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        )
    }
    //特级护理
    const specialNursingRecord = () => {
        return (
            <Form onFinish={() => { }} {...ULayout(8, 16)} style={{ width: '80%' }} form={specialNursingForm}>
                <Form.Item label="护理时间" name={'nursingTime'}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="是否晚间护理" name={'isEveningCare'}>
                    <Radio.Group>
                        <Radio value="0001">是</Radio>
                        <Radio value="0002">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="是否晨间护理" name={'isMorningCare'}>
                    <Radio.Group>
                        <Radio value="0001">是</Radio>
                        <Radio value="0002">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="是否有过敏史" name={'allergy'}>
                    <Radio.Group>
                        <Radio value="0001">是</Radio>
                        <Radio value="0002">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="出量记录" name={'output'} >
                    <Input size="small" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="入量记录" name={'input'} >
                    <Input size="small" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="预防压疮护理" name={'isPressureUlcersCare'} >
                    <Radio.Group>
                        <Radio value="0001">是</Radio>
                        <Radio value="0002">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="医院诊断" name={'hospitalDiagnosis'}>
                    <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={3} />
                </Form.Item>
                <Form.Item label="责任人" name={'personInCharge'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} />
                </Form.Item>
                <Form.Item label="精神状态及其他" name={'mentalState'}>
                    <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={4} />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="primary" size={'small'} style={{ position: "relative", right: 0 }}>
                            保存
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        )
    }
    //三测单
    const threeVolumeList = () => {
        return (
            <Form onFinish={() => { }} {...ULayout(8, 16)} style={{ width: '80%' }} form={threeVolumeForm}>
                <Form.Item label="过敏史" name={'n'}>
                    <Radio.Group>
                        <Radio value="a">是</Radio>
                        <Radio value="b">否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="护理日期" name={'a'}>
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="护理时间" name={'b'}>
                    <TimePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="手术后天数" name={'c'} >
                    <Input size="small" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="体温" name={'d'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="°C" />
                </Form.Item>
                <Form.Item label="脉搏心率" name={'e'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
                </Form.Item>
                <Form.Item label="呼吸" name={'f'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
                </Form.Item>
                <Form.Item label="血压" name={'g'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="mmHg" />
                </Form.Item>
                <Form.Item label="入量" name={'h'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
                </Form.Item>
                <Form.Item label=" 出量" name={'i'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
                </Form.Item>
                <Form.Item label=" 小便" name={'g'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
                </Form.Item>
                <Form.Item label=" 大便" name={'k'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
                </Form.Item>
                <Form.Item label=" 体重" name={'l'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="Kg" />
                </Form.Item>
                <Form.Item label=" 血氧饱和度" name={'m'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} />
                </Form.Item>
                <Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="primary"
                            size={'small'}
                            style={{ position: "relative", right: 0 }}
                            onClick={async () => {
                                if (ftype == "add") {
                                    let param = { ...bloodForm.getFieldsValue(), ...record }
                                    let res = await addSpecialNursing(param)
                                }
                                if (ftype == "edit") {
                                    let param = { ...bloodForm.getFieldsValue(), ...record }
                                    let res = await updateSpecialNursing(param)
                                }
                            }}
                        >
                            {ftype == "add" ? "保存" : "修改"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        )
    }
    return (
        <div className={styles["nursingAddRecord"]}>
            <div className={styles["top"]}>
                {renderSearch()}
            </div>
            <div className={styles["content"]}>
                <div className={styles["content-left"]}>
                    {renderPeopleInfo()}
                </div>
                <div className={styles["content-right"]}>
                    <Tabs defaultActiveKey="1" tabPosition={'left'}
                        activeKey={tabKey}
                        onChange={(key) => { setTabKey(key) }}
                    >
                        <TabPane tab="护理记录" key="1">
                            <div className={styles["addRecordBox"]}>
                                {renderNursingItem()}
                            </div>
                        </TabPane>
                        <TabPane tab="三测单" key="2">
                            <div className={styles["addRecordBox"]}>
                                {threeVolumeList()}
                            </div>
                        </TabPane>
                        <TabPane tab="血糖记录" key="3">
                            <div className={styles["addRecordBox"]}>
                                {bloodGlucoseRecord()}
                            </div>
                        </TabPane>
                        <TabPane tab="特级护理记录" key="4">
                            <div className={styles["addRecordBox"]}>
                                {specialNursingRecord()}
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default NursingAddRecord;
