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
  labelCol: { span: 11 },
  wrapperCol: { span: 13 },
};
const validateMessages = {
  required: '${label} is required!',
};
const RiskNotification = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  const [modalVisibleArchives, setModalVisibleArchives] = useState(false); //体检档案信息弹窗
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
        width={1000}
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        style={{marginTop:-50,marginRight:120}}
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
            杭州富阳颐乐老年护理中心入住老人潜在意外风险告知书
          </h2>
          <h3>
            {`尊敬的`}
            <span style={{ paddingLeft: 20, fontSize: 16 }}> {`${'李佳敏'}`}</span> {`老人家属：`}
          </h3>
          <div style={{ textIndent: '2em' }}>
            因入住老人年事已高、体弱多病，机体各器官趋于老化，各器官功能逐渐袁退，并伴有不同程度的基础疾病，老人存在自身机体状况及疾病发展的不可预测性，因此，老人在本养老机构寄养期间，有可能会出现在机构正常管理秩序及护理状态下所无法预控的意外现象为了能使您和您的家人与我们双方在老人寄养过程中能够相互理解，彼此信任，我养老机构特将寄养人存在的潜在意外风险向您作如下告知：
          </div>
          <div class="text">
            1、老人均患有不同程度的心脑血管疾病或有突发心脑血管疾病的高危致病因素，因此容易突发心肌梗塞、猝死、脑血管意外等突然性疾病及死亡现象。
          </div>
          <div class="text">
            2、老人都存在不同程度的骨质疏松，因此在寄养过程中老人可能因行走不稳而跌倒或在座椅、座便和活动时用力不均等原因，导致老人出现软组织伤、骨折(仿残)、死亡等意外。
          </div>
          <div class="text">
            3、寄老养人，特别是患有脑血管意外后遗症的老人，在饮食过程中可能会出现因吞咽障碍而导致的吞咽奎息、死亡等意外。
          </div>
          <div class="text">
            4、寄养老人可能因心理问题、家庭矛盾、情绪波动等原因导致老人出现轻生现象:坠楼、割脉、自等意外死亡。
          </div>
          <div class="text">
            5、寄养老人因性格孤僻、疑心重、牌气暴瞬等原因，导致出现极端异常行为，容易与其他老人发生冲突，引起相互间的伤害意外:软组织伤、骨折等伤亡意外。
          </div>
          <div class="text">
            6、寄养老人均有不同程度的脑缩现象，可能因思维障碍、情绪不稳定等原因，导致失去行为自控能力，出现攻击性或伤害性行为，造成自伤或第三人伤亡等意外，如:误食、误伤、软组织损伤、骨折、死亡等。{' '}
          </div>
          <div class="text">
            7、为避免失智老人出现可预见的意外伤害，我们对动、有伤害行为倾向的失智老人需提供保护性的约措施，由此可能会出现:软组织损伤、皮肤破溃等意外。
          </div>
          <div class="text">
            8、卧床寄养的老人基本都存在不同程度的低蛋白血症、或患有免疫功能方面的疾病，极易出现皮肤意外:皮肤水泡、难免压疮等。
          </div>
          <div class="text">
            9、老人不听医、护人员嘱咐和劝阻，自行行动、上所、洗浴、上下楼梯、自行外出等行为极易造成意外伤害甚至死亡等。
          </div>
          <div class="text" style={{ fontWeight: 'bold', textIndent: '2em' }}>
            本院工作人员已将上述入住老人潜在意外风险明确告知入住老人的委托人，在非服务不当的情況下，此意外情况出现，我养老机构不承担赔偿责任，特此告知
          </div>
          <Form onFinish={() => { }} {...layout2} style={{ marginTop: 20 }}>
            <Row gutter={24}>
              <Col span={14}>
                <Form.Item label="杭州富阳乐老年护理中心告知人签名:" name={'a'}>
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
                <Form.Item label="托养老人的监护人签名" name={'c'}>
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
