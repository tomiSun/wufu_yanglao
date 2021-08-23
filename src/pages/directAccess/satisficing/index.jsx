import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { Form, Input, Row, Col, Radio, Button, message, Space } from 'antd';
import { satisficingSelect, satisficingUpdate } from '@/services/directAccess/satisficing';

const { TextArea } = Input;
export default (props) => {
  const [phone, setPhone] = useState(props?.location?.query?.phone);
  const [btnConfig, setBtnConfig] = useState({ disabled: true, loading: false });
  console.log('phone: ', phone);
  useEffect(() => {
    if (phone) {
      verifySubmit();
    }
  }, [phone]);
  const verifySubmit = () => {
    satisficingSelect({ phone })
      .then((res) => {
        btnConfig.disabled = !!res?.data?.id;
        if (res?.data?.id) {
          modalForm.setFieldsValue({ ...res?.data });
        }
        setBtnConfig({ ...btnConfig });
      })
      .catch((err) => {
        console.log('satisficingSelect---err', err);
      });
  };
  // modal配置项
  const [modalForm] = Form.useForm();
  const saveModalInfo = async () => {
    const formData = await modalForm.validateFields();
    const query = {
      ...formData,
      phone,
      total: addTotal(),
    };
    btnConfig.loading = true;
    setBtnConfig({ ...btnConfig });
    satisficingUpdate(query)
      .then((response) => {
        message.success(response.msg);
        btnConfig.loading = false;
        btnConfig.disabled = true;
        setBtnConfig({ ...btnConfig });
        verifySubmit();
      })
      .catch((err) => {
        console.log('err-satisficingUpdate: ', err);
        btnConfig.loading = false;
        setBtnConfig({ ...btnConfig });
      });
  };
  const addTotal = () => {
    let {
      environment,
      careQuality,
      customerService,
      medicalService,
      recreationalActivity,
      diet,
      deal,
      syntheticService,
    } = modalForm.getFieldsValue();
    environment = (environment && parseInt(environment)) || 0;
    careQuality = (careQuality && parseInt(careQuality)) || 0;
    customerService = (customerService && parseInt(customerService)) || 0;
    medicalService = (medicalService && parseInt(medicalService)) || 0;
    recreationalActivity = (recreationalActivity && parseInt(recreationalActivity)) || 0;
    diet = (diet && parseInt(diet)) || 0;
    deal = (deal && parseInt(deal)) || 0;
    syntheticService = (syntheticService && parseInt(syntheticService)) || 0;
    const res =
      environment +
      careQuality +
      customerService +
      medicalService +
      recreationalActivity +
      diet +
      deal +
      syntheticService;
    return res;
  };
  return (
    <div className={styles.satisficing}>
      <div className={styles.title}>老人（家属）满意度测评表</div>

      <div style={{}}>
        <p>尊敬的长辈（家属）：</p>
        <p style={{ textIndent: '2em' }}>
          您好！为了更好的为您提供更优质的服务，现向您征求意见，请根据您的实际感受作答，勾选相应的选项，或在意见和建议栏填写内容，感谢的您的支持和配合
        </p>
      </div>
      <Form
        name="basic"
        layout="vertical"
        form={modalForm}
        // labelCol={{ flex: '90px' }}
        initialValues={{}}
      >
        <Row>
          {/* <Col span={24}>
              <Form.Item name="rate" label="1,您对本院生活环境满意吗？（设备，卫生周边）">
                <Rate />
              </Form.Item>
            </Col> */}
          <Col span={24}>
            <Form.Item
              name="environment"
              label="1,您对本院生活环境满意吗？（设备，卫生周边）"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="careQuality"
              label="2,您对护理质量满意吗？（态度，操作，个人卫生）"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="customerService"
              label="3,您对本院客服人员院管理人员满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="medicalService"
              label="4,您对医疗服务满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="recreationalActivity"
              label="5,您对本院组织的各项日常文化娱乐活动满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="diet"
              label="6,您对现在的饮食满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="deal"
              label="7,您对本院日常事情处理时间，处理态度，处理结果满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="syntheticService"
              label="8,您对本院各部门综合服务水平满意吗？"
              rules={[{ required: true, message: 'Please pick an item!' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="3">满意（3）</Radio>
                  <Radio value="2">较满意（2）</Radio>
                  <Radio value="1">不满意（1）</Radio>
                  <Radio value="0">说不出（0）</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          {/* <Col span={24}>
            <Form.Item label="总计" name="total">
              <Input placeholder="请输入" disabled />
            </Form.Item>
          </Col> */}

          <Col span={24}>
            <Form.Item label="您的其他意见和建议" name="suggestion">
              <TextArea placeholder="请输入" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary" {...btnConfig} onClick={saveModalInfo}>
          提交
        </Button>
      </div>
    </div>
  );
};
