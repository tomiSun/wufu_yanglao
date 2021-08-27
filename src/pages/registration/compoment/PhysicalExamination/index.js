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
  message,
} from 'antd';
import {
  examArchiveDel,
  examArchiveQuery,
  examArchiveUpdate,
  examArchiveSave,
} from '@/services/inHospitalRegister/index.js';
import { dictDateSelect } from '@/services/basicSetting/dictionary';
import moment from 'moment';
const DICT_LSIT = { '0009': [], '0015': [], '0016': [], '0017': [] };
const DICT_ARR = ['0009', '0015', '0016', '0017'];
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
  const [mode, setMode] = useState('add'); //模式是新增还是编辑

  //form
  const [busExamArchiveForm] = Form.useForm(); //基础与总结
  const [busExamEntArchiveForm] = Form.useForm(); //五官
  const [busExamEyesArchiveForm] = Form.useForm(); //眼科
  const [busExamInternalArchiveForm] = Form.useForm(); //内科
  const [busExamOtherArchiveForm] = Form.useForm(); //检查
  const [busExamSurgicalArchiveForm] = Form.useForm(); //外科
  const [selectKey, setSelectKey] = useState("1");
  //更新时的ID
  const [updateId, setUpdateId] = useState('');
  const [dictionaryMap, setDictionaryMap] = useState(DICT_LSIT);

  useEffect(() => {
    initData();
    //获取字典
    getDictDataSelect(DICT_ARR); //过敏史
  }, []);
  //获取字典
  const getDictDataSelect = async (dList) => {
    let resMap = {};
    for (const [idx, it] of dList.entries()) {
      let param = { pageNum: 1, pageSize: 20, typeCode: String(it) };
      const res = await dictDateSelect(param);
      let key = param['typeCode'];
      resMap[key] = res['data']['list'];
      if (idx == dList.length - 1) {
        setDictionaryMap(resMap);
      }
    }
  };
  //初始化 判断是新增还是编辑
  const initData = async () => {
    busExamArchiveForm.setFieldsValue(selectRowData);
    let resQuery = await examArchiveQuery({ businessNo: selectRowData['businessNo'] });
    if (resQuery['code'] == 200 && !!resQuery['data']) {
      let data = {
        ...resQuery['data']['busExamArchiveQueryVO'],
        ...resQuery['data']['busExamEntArchiveQueryVO'],
        ...resQuery['data']['busExamEyesArchiveQueryVO'],
        ...resQuery['data']['busExamInternalArchiveQueryVO'],
        ...resQuery['data']['busExamOtherArchiveQueryVO'],
        ...resQuery['data']['busExamSurgicalArchiveQueryVO'],
        signTime: moment(resQuery['data']['busExamArchiveForm']?.['signTime'] || new Date()),
      };
      busExamArchiveForm.setFieldsValue({ ...data });
      busExamEntArchiveForm.setFieldsValue({ ...data, ...resQuery['data']['busExamEntArchiveQueryVO'] });
      busExamEyesArchiveForm.setFieldsValue({ ...data, ...resQuery['data']['busExamEyesArchiveQueryVO'] });
      busExamInternalArchiveForm.setFieldsValue({ ...data, ...resQuery['data']['busExamInternalArchiveQueryVO'] });
      busExamOtherArchiveForm.setFieldsValue({ ...data, ...resQuery['data']['busExamOtherArchiveQueryVO'] });
      busExamSurgicalArchiveForm.setFieldsValue({ ...data, ...resQuery['data']['busExamSurgicalArchiveQueryVO'] });
      let id = resQuery['data']['busExamArchiveQueryVO']['id'];
      setUpdateId(id);
      setMode('edit');
    } else {
      setMode('add');
    }
  };
  //清除
  const formReset = () => {
    busExamArchiveForm.resetFields();
    busExamEntArchiveForm.resetFields();
    busExamEyesArchiveForm.resetFields();
    busExamInternalArchiveForm.resetFields();
    busExamOtherArchiveForm.resetFields();
    busExamSurgicalArchiveForm.resetFields();
  };
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
          formReset();
        }}
        onCancel={() => {
          onPhysicalExaminationVisible(false);
          formReset();
        }}
        style={{ marginTop: -70 }}
      >
        <Tabs defaultActiveKey="1" onChange={(key) => { setSelectKey(key) }}>
          <TabPane tab="基本信息" key="1">
            <Form
              style={{ width: 500, margin: 10 }}
              form={busExamArchiveForm}
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
            >
              <Form.Item name={'archiveId'} label="档案ID" {...layout}>
                <Input disabled />
              </Form.Item>
              <Form.Item name={'businessNo'} label="住院号" {...layout}>
                <Input disabled />
              </Form.Item>
              <Form.Item name={'name'} label="姓名">
                <Input disabled />
              </Form.Item>
              <Form.Item name={'sex'} label="性别" initialValue={'1'}>
                <Radio.Group onChange={() => { }} defaultValue={'1'} disabled>
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'2'}>女</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name={'age'} label="年龄">
                <Input />
              </Form.Item>
              <Form.Item name={'contactNumber'} label="联系电话">
                <Input />
              </Form.Item>
              <Form.Item name={'education'} label="文化程度" initialValue={'0003'}>
                <Select onChange={() => { }}>
                  {dictionaryMap?.['0016'].map((item) => {
                    return <Option value={item['dictCode']}>{item['dictName']}</Option>;
                  })}
                </Select>
              </Form.Item>
              <Form.Item name={'medicalHistoryCode'} label="既往史">
                <Select mode="multiple" onChange={() => { }}>
                  {dictionaryMap?.['0009'].map((item) => {
                    return <Option value={item['dictCode']}>{item['dictName']}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="眼科" key="2">
            <Form
              style={{ width: 500, margin: 10 }}
              form={busExamEyesArchiveForm}
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
            >
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
              <Form.Item name={'colorVisionCode'} label="色觉" initialValue={'0001'}>
                <Select onChange={() => { }}>
                  {dictionaryMap?.['0017'].map((item) => {
                    return <Option value={item['dictCode']}>{item['dictName']}</Option>;
                  })}
                </Select>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="五官科" key="3">
            <Form
              style={{ width: 500, margin: 10 }}
              form={busExamEntArchiveForm}
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
            >
              <Form.Item name={'hearingLeft'} label="听力左">
                <Input />
              </Form.Item>
              <Form.Item name={'hearingRight'} label="听力右">
                <Input />
              </Form.Item>
              <Form.Item name={'earCode'} label="耳疾" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'smellCode'} label="嗅觉" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'stutteringCode'} label="口吃" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'faceCode'} label="颜面部" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'other'} label="其他">
                <Input />
              </Form.Item>
              <Form.Item name={'signature'} label="检查医生" >
                <Input />
              </Form.Item>
              <Form.Item name={'suggestion'} label="医生建议">
                <Input.TextArea />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="内科" key="4">
            <Form
              style={{ width: 500, margin: 10 }}
              form={busExamInternalArchiveForm}
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
            >
              <Form.Item name={'heartRate'} label="心率">
                <Input />
              </Form.Item>
              <Form.Item name={'bloodPressureHigh'} label="高压">
                <Input />
              </Form.Item>
              <Form.Item name={'bloodPressureLow'} label="低压">
                <Input />
              </Form.Item>
              <Form.Item name={'nutritureCode'} label="发育及营养状况" initialValue={'0'}>
                <Select defaultValue={'0'} onChange={() => { }}>
                  <Option value="0">良好</Option>
                  <Option value="1">一般</Option>
                  <Option value="C">差</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'cardiovascularCode'} label="心血管" initialValue={'0'}>
                <Select defaultValue={'0'} onChange={() => { }}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'nerveCode'} label="神经及精神" initialValue={'0'}>
                <Select defaultValue={'0'} onChange={() => { }}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'lungCode'} label="肺及呼吸道" initialValue={'0'}>
                <Select defaultValue={'0'} onChange={() => { }}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'liverCode'} label="肝" initialValue={'0'}>
                <Select defaultValue={'0'} onChange={() => { }}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'spleenCode'} label="脾" initialValue={'0'}>
                <Select defaultValue={'0'} onChange={() => { }}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'other'} label="其他">
                <Input />
              </Form.Item>
              <Form.Item name={'signature'} label="检查医生">
                <Input></Input>
              </Form.Item>
              <Form.Item name={'suggestion'} label="医生建议">
                <Input.TextArea />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="外科" key="5">
            <Form
              style={{ width: 500, margin: 10 }}
              form={busExamSurgicalArchiveForm}
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
            >
              <Form.Item name={'height'} label="身长">
                <Input />
              </Form.Item>
              <Form.Item name={'shapeSign'} label="体重">
                <Input />
              </Form.Item>
              <Form.Item name={'skinCode'} label="皮肤" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'limbsCode'} label="四肢" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'lymphaticCode'} label="淋巴" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'jointsCode'} label="关节" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'spineCode'} label="脊柱" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'thyroidCode'} label="甲状腺" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">其他</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'other'} label="其他">
                <Input />
              </Form.Item>
              <Form.Item name={'signature'} label="检查医生">
                <Input />
              </Form.Item>
              <Form.Item name={'suggestion'} label="医生建议">
                <Input.TextArea />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="检验检查" key="6">
            <Form
              style={{ width: 500, margin: 10 }}
              form={busExamOtherArchiveForm}
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
            >
              <Form.Item name={'routineBloodCode'} label="血常规" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">异常</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'altCode'} label="肝肾功能" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">异常</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'routineUrineCode'} label="尿常规" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">异常</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'chestPerspectiveCode'} label="肝肾功能" initialValue={'0'}>
                <Select defaultValue={'0'}>
                  <Option value="0">正常</Option>
                  <Option value="1">异常</Option>
                </Select>
              </Form.Item>
              <Form.Item name={'chestPerspectiveSign'} label="胸透签字">
                <Input />
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="体检结果" key="7">
            <Form
              style={{ width: 500, margin: 10 }}
              form={busExamArchiveForm}
              {...layout}
              name="nest-messages"
              validateMessages={validateMessages}
            >
              <Form.Item name={'signTime'} label="检查时间">
                <DatePicker style={{ width: '100%' }} />
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
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    );
  };
  const renderBtnArea = () => {
    //新增按钮
    let addBtn = (
      <Button
        onClick={async () => {
          let addParam = {
            busExamArchiveInsertPO: busExamArchiveForm.getFieldsValue(),
            busExamEntArchiveInsertPO: busExamEntArchiveForm.getFieldsValue(),
            busExamEyesArchiveInsertPO: busExamEyesArchiveForm.getFieldsValue(),
            busExamInternalArchiveInsertPO: busExamInternalArchiveForm.getFieldsValue(),
            busExamOtherArchiveInsertPO: busExamOtherArchiveForm.getFieldsValue(),
            busExamSurgicalArchiveInsertPO: busExamSurgicalArchiveForm.getFieldsValue(),
          };
          let res3 = await examArchiveSave(addParam);
          message.success('新增成功');
          onPhysicalExaminationVisible(false);
          formReset();
        }}
      >
        保存
      </Button>
    );
    //删除按钮
    let delBtn = (
      <Button
        onClick={async () => {
          let res1 = await examArchiveDel({ businessNo: selectRowData['businessNo'] });
          message.success('删除成功');
          onPhysicalExaminationVisible(false);
          formReset();
        }}
      >
        删除
      </Button>
    );
    //编辑按钮
    let editBtn = (
      <Button
        onClick={async () => {
          let updateParam = {
            busExamArchiveUpdatePO: { ...busExamArchiveForm.getFieldsValue(), id: updateId },
            busExamEntArchiveUpdatePO: busExamEntArchiveForm.getFieldsValue(),
            busExamEyesArchiveUpdatePO: busExamEyesArchiveForm.getFieldsValue(),
            busExamInternalArchiveUpdatePO: busExamInternalArchiveForm.getFieldsValue(),
            busExamOtherArchiveUpdatePO: busExamOtherArchiveForm.getFieldsValue(),
            busExamSurgicalArchiveUpdatePO: busExamSurgicalArchiveForm.getFieldsValue(),
          };
          let res3 = await examArchiveUpdate(updateParam);
          message.success('修改成功');
          onPhysicalExaminationVisible(false);
          formReset();
        }}
      >
        修改
      </Button>
    );
    //清空按钮
    let clearBtn = (
      <Button
        onClick={async () => {
          selectKey == "2" && busExamEyesArchiveForm.resetFields()
          selectKey == "3" && busExamEntArchiveForm.resetFields()
          selectKey == "4" && busExamInternalArchiveForm.resetFields()
          selectKey == "5" && busExamSurgicalArchiveForm.resetFields()
          selectKey == "6" && busExamOtherArchiveForm.resetFields()
          selectKey == "7" && busExamArchiveForm.resetFields()
        }}
      >
        清空
      </Button>
    );
    let arrEdit = selectKey == "1" ? [editBtn, delBtn] : [editBtn, clearBtn];
    let arrAdd = [addBtn];
    if (mode == 'edit') {
      return arrEdit;
    }
    if (mode == 'add') {
      return arrAdd;
    }

    return arrAdd;
  };
  return <div>{renderPhysicalExaminationModal()}</div>;
};

export default PhysicalExamination;
