/**试用期评估 */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Select,
  Radio,
  Row,
  Col,
  Input,
  DatePicker,
  Modal,
  message
} from 'antd';
import {
  contractQuery,
  contractUpdate,
  contractSave
} from '@/services/inHospitalRegister/index.js'
import moment from 'moment';
const layout = (x, y) => {
  return {
    labelCol: { span: x },
    wrapperCol: { span: y },
  }
};
const validateMessages = {
  required: '${label} is required!',
};
const AgreementForm = (props) => {
  //属性
  const { selectRowData, onAgreementFormVisibleVisible, visible } = props;
  //变量
  const [mode, setMode] = useState("add");//模式是新增还是编辑
  //form
  const [agreementForm] = Form.useForm();//基础与总结
  //更新时的ID
  const [updateId, setUpdateId] = useState("")
  useEffect(() => {
    initData()
  }, []);
  //初始化 判断是新增还是编辑
  const initData = async () => {
    agreementForm.setFieldsValue(selectRowData)
    let resQuery = await contractQuery({ "businessNo": selectRowData['businessNo'] })
    if (resQuery['code'] == 200 && !!resQuery['data']) {
      let id = resQuery['data']['id'];
      agreementForm.setFieldsValue({
        ...resQuery['data'],
        guardianTime: moment(resQuery['data']['guardianTime']),
        directorTime: moment(resQuery['data']['directorTime']),
      })
      setUpdateId(id)
      setMode("edit")
    } else {
      setMode("add")
    }
  }
  //体检弹窗
  const renderAgreementModal = () => {
    return (
      <Modal
        title="入住合同"
        width={1000}
        visible={visible}
        onOk={() => {
          onAgreementFormVisibleVisible(false)
          // setModalVisible(false);
        }}
        onCancel={() => {
          onAgreementFormVisibleVisible(false)
        }}
        style={{ marginTop: -50, marginRight: 120 }}
        footer={renderBtnArea()}
      >
        <div style={{ padding: 30 }}>
          <h2 style={{ textAlign: 'center' }}>
            <a>杭州富阳颐乐老年护理中心老人入住合同</a>
          </h2>
          <Form onFinish={() => { }} {...layout(8, 16)} style={{ marginTop: 20 }} form={agreementForm}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="负责人签名:" name={'director'}>
                  <Input width="200" size="small" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="签订时间" name={'directorTime'} initialValue={moment(new Date())}>
                  <DatePicker style={{ width: 200 }} size="small" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="监护人签名" name={'guardian'}>
                  <Input width="200" size="small" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="签订时间" name={'guardianTime'} initialValue={moment(new Date())}>
                  <DatePicker style={{ width: 200 }} size="small" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    )
  }
  const renderBtnArea = () => {
    //新增按钮
    let addBtn = <Button onClick={async () => {
      let addParam = { ...selectRowData, ...agreementForm.getFieldsValue(), }
      let res = await contractSave(addParam);
      message.success("新增成功")
      onAgreementFormVisibleVisible(false)
    }}>保存</Button>;
    //编辑按钮
    let editBtn = <Button onClick={async () => {
      let updateParam = { ...selectRowData, ...agreementForm.getFieldsValue(), id: updateId }
      let res = await contractUpdate(updateParam);
      message.success("修改成功")
      onAgreementFormVisibleVisible(false)
    }}>修改</Button>
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
  return (<div>
    {renderAgreementModal()}
  </div>
  );
};

export default AgreementForm;