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
const layout = (x, y, labelAlign, layout) => {
  return {
    labelCol: { span: x },
    wrapperCol: { span: y },
    labelAlign,
    layout,
  };
};
const layout2 = {
  labelCol: { span: 11 },
  wrapperCol: { span: 13 },
};
const validateMessages = {
  required: '${label} 为必填项',
}; //validateMessages={validateMessages}
const RloodGlucoseRecord = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  const [modalVisibleArchives, setModalVisibleArchives] = useState(false); //体检档案信息弹窗
  // 搜索部分
  const renderSearch = () => {
    return (
      <Form onFinish={() => { }} {...layout(8, 16, 'left', 'inline')}>
        <Form.Item label="姓名" name={'name'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item label="档案ID" name={'id'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item label="采样时间" name={'time'}>
          <DatePicker size={'small'} />
        </Form.Item>
        <Form.Item label="采样时间段" name={'name'}  {...layout(12, 16)}>
          <Select defaultValue="1" size={'small'}>
            <Option value="1">早餐后2h</Option>
            <Option value="2">午睡前</Option>
            <Option value="3">午餐后2h</Option>
            <Option value="4">晚餐前</Option>
            <Option value="5">晚餐后2h</Option>
            <Option value="6">睡前</Option>
            <Option value="7">随机血糖</Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ marginLeft: 20 }}>
          <Button type="primary" size={'small'} style={{ marginTop: 4 }}>
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            style={{ marginTop: 4 }}
            onClick={() => {
              setModalVisible(true);
            }}
          >
            新增记录
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
        title="血糖检测"
        width={600}
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
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
        <Form onFinish={() => { }} {...layout(8, 16)} style={{ margin: '25px 10px 45px 0px' }}>
          <Form.Item label="姓名:" name={'a'}>
            <Input.Search size="small" style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="是否空腹" name={'b'}>
            <Radio.Group>
              <Radio value="a">是</Radio>
              <Radio value="b">否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="采样时间段" name={'d'}>
            <Select style={{ width: 300 }} defaultValue="1">
              <Option value="1">早餐后2h</Option>
              <Option value="2">午睡前</Option>
              <Option value="3">午餐后2h</Option>
              <Option value="4">晚餐前</Option>
              <Option value="5">晚餐后2h</Option>
              <Option value="6">睡前</Option>
              <Option value="7">随机血糖</Option>
            </Select>
          </Form.Item>
          <Form.Item label="采样时间" name={'e'}>
            <DatePicker style={{ width: 300 }} />
          </Form.Item>
          <Form.Item label="血糖值(单位：mmol)" name={'c'}>
            <Input size="small" style={{ width: 300 }} />
          </Form.Item>
        </Form>
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

export default RloodGlucoseRecord;
