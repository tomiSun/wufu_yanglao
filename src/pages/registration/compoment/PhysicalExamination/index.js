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
} from 'antd';
import {
  examArchiveDel,
  examArchiveQuery,
  examArchiveUpdate,
  examArchiveSave
} from '@/services/inHospitalRegister/index.js'
const { TabPane } = Tabs;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const validateMessages = {
  required: '${label} is required!',
};
const PhysicalExamination = (props) => {
  //属性
  const { selectRowData, onPhysicalExaminationVisible, visible } = props;
  //变量
  const [mode, setMode] = useState("add");//模式是新增还是编辑
  
  //form
  const [busExamArchiveForm] = Form.useForm();//基础与总结
  const [busExamEntArchiveForm] = Form.useForm();//五官
  const [busExamEyesArchiveForm] = Form.useForm();//眼科
  const [busExamInternalArchiveForm] = Form.useForm();//内科
  const [busExamOtherArchiveForm] = Form.useForm();//检查
  const [busExamSurgicalArchiveForm] = Form.useForm();//外科
  //更新时的ID
  const [updateId, setUpdateId] = useState("")
  useEffect(() => {
    initData()
  }, []);
  //初始化 判断是新增还是编辑
  const initData = async () => {
    busExamArchiveForm.setFieldsValue(selectRowData)
    let resQuery = await examArchiveQuery({ "businessNo": selectRowData['businessNo'] })
    if (resQuery['code'] == 200 && !!resQuery['data']) {
      let id = resQuery['data']['busExamArchiveQueryVO']['id']
      setUpdateId(id)
      setMode("edit")
    } else {
      setMode("add")
    }
  }
  //体检弹窗
  const renderPhysicalExaminationModal = () => {
    return (
      <Modal
        title="体检信息"
        width={650}
        visible={visible}
        footer={renderBtnArea()}
        onOk={() => {
          onPhysicalExaminationVisible(false);
        }}
        onCancel={() => {
          onPhysicalExaminationVisible(false);
        }}
      >
        <Tabs defaultActiveKey="1" onChange={() => { }}>
          <TabPane tab="基本信息" key="1">
            <Card title="基本信息" style={{ width: 400 }}>

              <Form
                form={busExamArchiveForm}
                {...layout} name="nest-messages" validateMessages={validateMessages}>
                <Form.Item name={'aichiveId'} label="档案ID" {...layout} >
                  <Input disabled/>
                </Form.Item>
                <Form.Item name={'businessNo'} label="住院号" {...layout}>
                  <Input  disabled/>
                </Form.Item>
                <Form.Item
                  name={'name'}
                  label="姓名"
                >
                  <Input  disabled/>
                </Form.Item>
                <Form.Item
                  name={'sex'}
                  label="性别"
                >
                  <Radio.Group onChange={() => { }} defaultValue={"1"} disabled>
                    <Radio value={"1"}>男</Radio>
                    <Radio value={"2"}>女</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={'age'} label="年龄">
                  <Input />
                </Form.Item>
                <Form.Item name={'contactNumber'} label="联系电话">
                  <Input />
                </Form.Item>
                <Form.Item name={'education'} label="文化程度">
                  <Input />
                </Form.Item>
                <Form.Item name={'medicalHistoryCodeList'} label="既往史">
                  <Select mode="multiple" defaultValue={['0', '1']} onChange={() => { }}>
                    <Option value='0'>高血压</Option>
                    <Option value='1'>糖尿病</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
          <TabPane tab="眼科" key="2">
            <Form
              form={busExamEyesArchiveForm}
              {...layout} name="nest-messages" validateMessages={validateMessages}>
              <Card title="眼科信息" style={{ width: 400 }}>
                <Form.Item name={'ucvaLeft'} label="裸眼视力左">
                  <Input />
                </Form.Item>
                <Form.Item name={'ucvaRight'} label="裸眼视力右">
                  <Input />
                </Form.Item>
                <Form.Item name={'cvaLeft'} label="矫正视力左">
                  <Input />
                </Form.Item>
                <Form.Item name={'cvaRight'} label="矫正视力右">
                  <Input />
                </Form.Item>
                <Form.Item name={'colorVisionCode'} label="色觉">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>不正常</Option>
                    <Option value="C">单色能辨</Option>
                    <Option value="D">单色不能辨</Option>
                  </Select>
                </Form.Item>
              </Card>
            </Form>
          </TabPane>
          <TabPane tab="五官科" key="3">
            <Form
              form={busExamEntArchiveForm}
              {...layout} name="nest-messages" validateMessages={validateMessages}>
              <Card title="五官科信息" style={{ width: 400 }}>
                <Form.Item name={'hearingLeft'} label="听力左">
                  <Input />
                </Form.Item>
                <Form.Item name={'hearingRight'} label="听力右">
                  <Input />
                </Form.Item>
                <Form.Item name={'earCode'} label="耳疾">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'smellCode'} label="嗅觉">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'stutteringCode'} label="口吃">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'faceCode'} label="颜面部">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'other'} label="其他">
                  <Input />
                </Form.Item>
                <Form.Item name={'signature'} label="检查医生">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>张三</Option>
                    <Option value='1'>李四</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'suggestion'} label="医生建议">
                  <Input.TextArea />
                </Form.Item>
              </Card>
            </Form>
          </TabPane>
          <TabPane tab="内科" key="4">
            <Form
              form={busExamInternalArchiveForm}
              {...layout} name="nest-messages" validateMessages={validateMessages}>
              <Card title="内科科信息" style={{ width: 400 }}>
                <Form.Item name={'heartRate'} label="心率">
                  <Input />
                </Form.Item>
                <Form.Item name={'bloodPressureHigh'} label="高压">
                  <Input />
                </Form.Item>
                <Form.Item name={'bloodPressureLow'} label="低压">
                  <Input />
                </Form.Item>
                <Form.Item name={'nutritureCode'} label="发育及营养状况">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>良好</Option>
                    <Option value='1'>一般</Option>
                    <Option value="C">差</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'cardiovascularCode'} label="心血管">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'nerveCode'} label="神经及精神">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'lungCode'} label="肺及呼吸道">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'liverCode'} label="肝">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'spleenCode'} label="脾">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'other'} label="其他">
                  <Input />
                </Form.Item>
                <Form.Item name={'signature'} label="检查医生">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>张三</Option>
                    <Option value='1'>李四</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'suggestion'} label="医生建议">
                  <Input.TextArea />
                </Form.Item>
              </Card>
            </Form>
          </TabPane>
          <TabPane tab="外科" key="5">
            <Form
              form={busExamSurgicalArchiveForm}
              {...layout} name="nest-messages" validateMessages={validateMessages}>
              <Card title="外科信息" style={{ width: 400 }}>
                <Form.Item name={'height'} label="身长">
                  <Input />
                </Form.Item>
                <Form.Item name={'shapeSign'} label="体重">
                  <Input />
                </Form.Item>
                <Form.Item name={'skinCode'} label="皮肤">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'limbsCode'} label="四肢">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'lymphaticCode'} label="淋巴">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'jointsCode'} label="关节">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'spineCode'} label="脊柱">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'thyroidCode'} label="甲状腺">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>其他</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'other'} label="其他">
                  <Input />
                </Form.Item>
                <Form.Item name={'signature'} label="检查医生">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>张三</Option>
                    <Option value='1'>李四</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'suggestion'} label="医生建议">
                  <Input.TextArea />
                </Form.Item>
              </Card>
            </Form>
          </TabPane>
          <TabPane tab="检验检查" key="6">
            <Form
              form={busExamOtherArchiveForm}
              {...layout} name="nest-messages" validateMessages={validateMessages}>
              <Card title="检验检查信息" style={{ width: 400 }}>
                <Form.Item name={'routineBloodCode'} label="血常规">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>异常</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'altCode'} label="肝肾功能">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>异常</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'routineUrineCode'} label="尿常规">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>异常</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'chestPerspectiveCode'} label="肝肾功能">
                  <Select defaultValue={['0']} onChange={() => { }}>
                    <Option value='0'>正常</Option>
                    <Option value='1'>异常</Option>
                  </Select>
                </Form.Item>
                <Form.Item name={'chestPerspectiveSign'} label="胸透签字">
                  <Input />
                </Form.Item>
              </Card>
            </Form>
          </TabPane>
          <TabPane tab="体检结果" key="8">
            <Form
              form={busExamArchiveForm}
              {...layout} name="nest-messages" validateMessages={validateMessages}>
              <Card title="体检结果信息" style={{ width: 400 }}>
                <Form.Item name={'signTime'} label="检查时间">
                  <DatePicker />
                </Form.Item>
                <Form.Item name={'mainDoctorSign'} label="总检医生">
                  <Input />
                </Form.Item>
                <Form.Item name={'physicalCheck'} label="总检结论">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name={'remark'} label="其他">
                  <Input.TextArea />
                </Form.Item>
              </Card>
            </Form>
          </TabPane>
        </Tabs>
      </Modal >
    )
  }
  const renderBtnArea = () => {
    //新增按钮
    let addBtn = <Button onClick={async () => {
      let addParam = {
        busExamArchiveInsertPO: busExamArchiveForm.getFieldsValue(),
        busExamEntArchiveInsertPO: busExamEntArchiveForm.getFieldsValue(),
        busExamEyesArchiveInsertPO: busExamEyesArchiveForm.getFieldsValue(),
        busExamInternalArchiveInsertPO: busExamInternalArchiveForm.getFieldsValue(),
        busExamOtherArchiveInsertPO: busExamOtherArchiveForm.getFieldsValue(),
        busExamSurgicalArchiveInsertPO: busExamSurgicalArchiveForm.getFieldsValue(),
      }
      let res3 = await examArchiveSave(addParam)
      console.log("AAA", JSON.stringify(addParam))
    }}>保存</Button>;
    //删除按钮
    let delBtn = <Button onClick={async () => {
      let res1 = await examArchiveDel({ "businessNo": selectRowData['businessNo'] })
    }}>删除</Button>
    //编辑按钮
    let editBtn = <Button onClick={async () => {
      let updateParam = {
        busExamArchiveUpdatePO: { ...busExamArchiveForm.getFieldsValue(), id: updateId },
        busExamEntArchiveUpdatePO: busExamEntArchiveForm.getFieldsValue(),
        busExamEyesArchiveUpdatePO: busExamEyesArchiveForm.getFieldsValue(),
        busExamInternalArchiveUpdatePO: busExamInternalArchiveForm.getFieldsValue(),
        busExamOtherArchiveUpdatePO: busExamOtherArchiveForm.getFieldsValue(),
        busExamSurgicalArchiveUpdatePO: busExamSurgicalArchiveForm.getFieldsValue(),
      }
      let res3 = await examArchiveUpdate(updateParam)
    }}>保存</Button>
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
    {renderPhysicalExaminationModal()}
  </div>
  );
};

export default PhysicalExamination;