/**试用期评估 */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Tabs,
  DatePicker
} from 'antd';
import moment from 'moment';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
  labelAlign: 'left',
  layout: 'inline',
};
const validateMessages = {
  required: '${label} is required!',
};
import {
  trialAssessmentDel,
  trialAssessmentQuery,
  trialAssessmentUpdate,
  trialAssessmentInsert
} from '@/services/inHospitalRegister/index.js'
import { ULayout } from '@/utils/common'
const Archives = (props) => {
  const [mode, setMode] = useState("add");//模式是新增还是编辑
  const { selectRowData, onProbationEvaluationVisible, visible } = props;
  //更新时的ID
  const [updateId, setUpdateId] = useState("")
  const [infoForm] = Form.useForm()
  useEffect(() => {
    initData()
  }, []);
  //初始化 判断是新增还是编辑
  const initData = async () => {
    let resQuery = await trialAssessmentQuery({ "businessNo": selectRowData['businessNo'] })
    if (resQuery['code'] == 200 && !!resQuery['data']) {
      let id = resQuery['data']['id'];
      let data = {
        ...resQuery['data'],
        lifeEvaluateTime: record?.lifeEvaluateTime && moment(record?.lifeEvaluateTime),
        cognitiveEvaluateTime: record?.cognitiveEvaluateTime && moment(record?.cognitiveEvaluateTime),
        emotionBehaviorEvaluateTime: record?.emotionBehaviorEvaluateTime && moment(record?.emotionBehaviorEvaluateTime),
        healthEvaluateTime: record?.healthEvaluateTime && moment(record?.healthEvaluateTime),
        specialRequirementTime: record?.specialRequirementTime && moment(record?.specialRequirementTime),
        admissionTime: record?.admissionTime && moment(record?.admissionTime),
      }
      infoForm.setFieldsValue(data)
      setUpdateId(id)
      setMode("edit")
    } else {
      setMode("add")
    }
  }
  //弹窗
  const renderMoadl = () => {
    return (
      <Modal
        title="试用期评估"
        visible={visible}
        onOk={() => {
          onProbationEvaluationVisible(false)
        }}
        onCancel={() => {
          onProbationEvaluationVisible(false)
        }}
        footer={renderBtnArea()}
      >
        <Form {...ULayout(8, 16)} name="nest-messages" validateMessages={validateMessages} form={infoForm}>
          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'lifeAbility'} label="评价">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'lifeAbilityEvaluator'} label="评估人">
              <Input />
            </Form.Item>
            <Form.Item name={'lifeEvaluateTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="认知能力（包括近期记忆，定向能力，判断能力）" style={{ width: '80%' }}>
            <Form.Item name={'cognitiveAbility'} label="评价">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'cognitiveAbilityEvaluator'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'cognitiveEvaluateTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="情绪行为（包括情绪、行为、沟通能力）" style={{ width: '80%' }}>
            <Form.Item name={'emotionBehavior'} label="评价">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'emotionBehaviorEvaluator'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'emotionBehaviorEvaluateTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="健康情况（包括心功能评定、视觉能力，疾病）" style={{ width: '80%' }}>
            <Form.Item name={'health'} label="评价">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'healthEvaluator'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'healthEvaluateTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="老人特殊需求" style={{ width: '80%' }}>
            <Form.Item name={'specialRequirement'} label="内容">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'specialRequirementEvaluator'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'specialRequirementTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="护理等级及评估小组评估意见" style={{ width: '80%' }}>
            <Form.Item name={'assessmentTeamSuggest'} label="评估小组建议">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'assessmentTeamSign'} label="评估小组签名">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'admissionTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="院长意见" style={{ width: '80%' }}>
            <Form.Item name={'deanSuggest'} label="院长意见">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'deanSign'} label="院长签名">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'deanSignTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="老人及家属意见" style={{ width: '80%' }}>
            <Form.Item name={'patientSuggest'} label="院长意见">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'patientSign'} label="签名">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'patientSignTime'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    );
  };
  //加载操作按钮
  const renderBtnArea = () => {
    let arr = [];
    //新增按钮
    let addBtn = <Button onClick={async () => {
      let param = { ...selectRowData, ...infoForm.getFieldsValue() }
      let res = await trialAssessmentInsert(param)
    }}>保存</Button>;
    //删除按钮
    let delBtn = <Button onClick={async () => {
      let res1 = await trialAssessmentDel({ "businessNo": selectRowData['businessNo'] })
    }}>删除</Button>
    //编辑按钮
    let editBtn = <Button onClick={async () => {
      let param = { ...selectRowData, ...infoForm.getFieldsValue(), id: updateId }
      let res = await trialAssessmentUpdate(param)
    }}>保存</Button>
    if (mode == "edit") {
      arr.push(editBtn)
      arr.push(delBtn)
    }
    if (mode == "add") {
      arr.push(addBtn)
    }
    return arr;
  }
  return (
    <div>
      {renderMoadl()}
    </div>
  );
};

export default Archives;
