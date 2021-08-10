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
import { dataSource, columns } from './data';
import './index.less';
const { TabPane } = Tabs;
const layout = (x, y) => {
  return {
    labelCol: { span: x },
    wrapperCol: { span: y },
    labelAlign: 'left',
    layout: 'inline',
  };
};
const layout2 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const validateMessages = {
  required: '${label} is required!',
};
const RiskNotification = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  // 搜索部分
  const renderSearch = () => {
    return (
      <Form onFinish={() => { }} {...layout(8, 16)}>
        <Form.Item label="姓名" name={'name'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item label="档案ID" name={'name'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item label="签订状态" name={'name'} {...layout(10, 16)}>
          <Select defaultValue="1" size={'small'}>
            <Option value="2">已签订</Option>
            <Option value="1">已签订</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" size={'small'} style={{ marginLeft: 20 }}>
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //操作
  const editButton = (record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {record.status == '0' && (
          <Button
            size={'small'}
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            签订
          </Button>
        )}
      </div>
    );
  };
  //表单
  const renderForm = () => {
    return (
      <div>
        <Table columns={columns(editButton)} dataSource={dataSource} />
      </div>
    );
  };
  //弹窗
  const renderMoadl = () => {
    return (
      <Modal
        title="风险告知书"
        width={800}
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        style={{ marginTop: -50, marginRight: 120 }}
        footer={[<div>
          <Button type={"primary"}
            onClick={() => {
              setModalVisible(false);
            }}>保存</Button>
          <Button
            onClick={() => {
              setModalVisible(false);
            }}
          >取消</Button>
        </div>]}
      >
        <div style={{ padding: 30 }}>
          <h2 style={{ textAlign: 'center' }}>
            <a  >
              杭州富阳颐乐老年护理中心入住老人潜在意外风险告知书
            </a>
          </h2>
          <Form onFinish={() => { }} {...layout2} style={{ marginTop: 20 }}>
            <Row gutter={24}>
              <Col span={14}>
                <Form.Item label="告知人签名:" name={'a'}>
                  <Input width="200" size="small" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="签订时间" name={'b'}>
                  <DatePicker width="200" size="small" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={14}>
                <Form.Item label="监护人签名" name={'c'}>
                  <Input width="200" size="small" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="签订时间" name={'time'}>
                  <DatePicker width="200" size="small" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  };

  return (
    <div class="archives">
      <div class="content">
        {renderSearch()}
        {renderForm()}
        {renderMoadl()}
      </div>
    </div>
  );
};

export default RiskNotification;
