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
const Archives = (props) => {
  const [mode, setMode] = useState("add");//模式是新增还是编辑
  const { selectRowData, onProbationEvaluationVisible, visible } = props;
  const { archiveId } = selectRowData;
  useEffect(() => {
    // initData()
  }, []);
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
      // footer={renderBtnArea()}
      >
        <Form {...layout} name="nest-messages" validateMessages={validateMessages}>
          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="认知能力（包括近期记忆，定向能力，判断能力）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>

          <Card title="生活能力（包括进食，个人卫生，穿衣，入厕及排便，移动）" style={{ width: '80%' }}>
            <Form.Item name={'a'} label="评估人">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={'b'} label="日期">
              <DatePicker />
            </Form.Item>
          </Card>
        </Form>
      </Modal>
    );
  };
  //加载操作按钮
  //   const renderBtnArea = async () => {
  //     let arr = [];
  //     //新增按钮
  //     let addBtn = <Button onClick={async() => {
  //       let res3 = await trialAssessmentUpdat({
  //         "admissionTime": "2021-08-01T14:26:35.371Z",
  //         "age": 10,
  //         "archiveId": '465188927389700096',//?
  //         "assessmentTeamSign": "孙成贺",
  //         "assessmentTeamSuggest": "高血压",
  //         "bedCode": "101",//
  //         "buildingCode": "1",//
  //         "businessNo": "77",
  //         "cognitiveAbility": "aaa",
  //         "cognitiveAbilityEvaluator": "孙成贺",
  //         "cognitiveEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "deanSign": "saaa",
  //         "deanSignTime": "2021-08-01T14:26:35.371Z",
  //         "deanSuggest": "aaa",
  //         "emotionBehavior": "aaa",
  //         "emotionBehaviorEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "emotionBehaviorEvaluator": "aaaa",
  //         "floorCode": "1",
  //         "health": "aaaa",
  //         "healthEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "healthEvaluator": "string",
  //         "lifeAbility": "aaa",
  //         "lifeAbilityEvaluator": "aaaa",
  //         "lifeEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "name": "bbb",
  //         "patientSign": "aaaa",
  //         "patientSignTime": "2021-08-01T14:26:35.371Z",
  //         "patientSuggest": "aaaaaa",
  //         "sex": "男",
  //         "specialRequirement": "aa",
  //         "specialRequirementEvaluator": "a",
  //         "specialRequirementTime": "2021-08-01T14:26:35.371Z",
  //         "teamSignTime": "2021-08-01T14:26:35.371Z"
  //       })
  //     }}>保存</Button>;
  //     //删除按钮
  //     let delBtn = <Button onClick={async() => {
  //       let res1 = await trialAssessmentDel({ "archiveId": "465188927389700096" })
  //     }}>删除</Button>
  //     //编辑按钮
  //     let editBtn = <Button onClick={async() => {
  //       let res3 = await trialAssessmentUpdat({
  //         "admissionTime": "2021-08-01T14:26:35.371Z",
  //         "age": 10,
  //         "archiveId": '465188927389700096',//?
  //         "assessmentTeamSign": "孙成贺",
  //         "assessmentTeamSuggest": "高血压",
  //         "bedCode": "101",//
  //         "buildingCode": "1",//
  //         "businessNo": "77",
  //         "cognitiveAbility": "aaa",
  //         "cognitiveAbilityEvaluator": "孙成贺",
  //         "cognitiveEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "deanSign": "saaa",
  //         "deanSignTime": "2021-08-01T14:26:35.371Z",
  //         "deanSuggest": "aaa",
  //         "emotionBehavior": "aaa",
  //         "emotionBehaviorEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "emotionBehaviorEvaluator": "aaaa",
  //         "floorCode": "1",
  //         "health": "aaaa",
  //         "healthEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "healthEvaluator": "string",
  //         "lifeAbility": "aaa",
  //         "lifeAbilityEvaluator": "aaaa",
  //         "lifeEvaluateTime": "2021-08-01T14:26:35.371Z",
  //         "name": "bbb",
  //         "patientSign": "aaaa",
  //         "patientSignTime": "2021-08-01T14:26:35.371Z",
  //         "patientSuggest": "aaaaaa",
  //         "sex": "男",
  //         "specialRequirement": "aa",
  //         "specialRequirementEvaluator": "a",
  //         "specialRequirementTime": "2021-08-01T14:26:35.371Z",
  //         "teamSignTime": "2021-08-01T14:26:35.371Z"
  //       })
  //     }}>保存</Button>
  //     if (mode == "edit") {
  //       arr.push(editBtn)
  //       arr.push(delBtn)
  //     }
  //     if (mode == "add") {
  //       arr.push(addBtn)
  //     }
  //     return arr;
  //   }
  return (
    <div>
      {renderMoadl()}
    </div>
  );
};

export default Archives;
