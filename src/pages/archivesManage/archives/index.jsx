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
  message
} from 'antd';
import { dataSource, columns } from './data';
import {
  baseArchiveDel,
  baseArchiveQuery,
  baseArchiveUpdate,
  baseArchiveInsert
} from '@/services/archives'
import './index.less';
const { TabPane } = Tabs;
const layout = (x, y, labelAlign, layout) => {
  return {
    labelCol: { span: x },
    wrapperCol: { span: y },
    labelAlign,
    layout
  }
};
const validateMessages = {
  required: '${label} is required!',
};

const Archives = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  const [archivesForm] = Form.useForm()
  const [SFrom] = Form.useForm()
  const [dataSource, setDataSource] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [type, setType] = useState("add");

  const refushList = async () => {
    let param = SFrom.getFieldsValue();
    let res = await baseArchiveQuery({ ...param, pageSize: 1000, pageNum: 1 })
    setDataSource(res['data']['list'])
  }
  const renderSearch = () => {
    return (
      <Form  {...layout(8, 16, "left", "inline")} form={SFrom}>
        <Form.Item label="姓名" name={'name'}>
          <Input width="200" size={'small'} />
        </Form.Item>
        <Form.Item label="档案ID" name={'archiveId'}>
          <Input width="200" size={'small'} />
        </Form.Item>
        <Form.Item >
          <Button
            type="primary"
            size={'small'}
            onClick={async () => {
              refushList()
            }}
          >
            查询
          </Button>
        </Form.Item>
        <Form.Item >
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              setModalVisible(true);
              setType('add')
            }}
          >
            新增
          </Button>
        </Form.Item >
      </Form>
    );
  };
  //操作
  const editButton = (row) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button size={'small'} type="link" onClick={() => {
          setType('edit')
          setSelectData(row)
          archivesForm.setFieldsValue(row)
          setModalVisible(true);
        }} size="small">
          编辑
        </Button>
        <Button size={'small'} type="link" onClick={async () => {
          debugger
          let res = await baseArchiveDel({ id: row['id'] })
          message.success("删除成功")
          refushList()
        }} size="small">
          删除
        </Button>
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
        title="老人档案"
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        footer={null}
      >
        <>
          <Card title="基本信息" style={{ width: '80%' }}>
            <Form {...layout(8, 16)} name="nest-messages"
              validateMessages={validateMessages}
              form={archivesForm}>
              <Form.Item
                name={'name'}
                label="姓名"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={'sex'}
                label="性别"
                rules={[{ required: true }]}
              >
                <Radio.Group onChange={() => { }} defaultValue={"1"}>
                  <Radio value={"1"}>男</Radio>
                  <Radio value={"2"}>女</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name={'age'} label="年龄">
                <Input />
              </Form.Item>
              <Form.Item name={'idCard'} label="身份证号">
                <Input />
              </Form.Item>
              <Form.Item name={'guardianName'} label="联系人姓名">
                <Input />
              </Form.Item>
              <Form.Item name={'relation'} label="关系">
                <Input />
              </Form.Item>
              <Form.Item name={'contactNumber'} label="联系电话">
                <Input />
              </Form.Item>
              <Form.Item name={'contactAddress'} label="家庭住址">
                <Input.TextArea />
              </Form.Item>
              <Form.Item >
                <Button
                  style={{ marginLeft: 200 }}
                  type={"primary"}
                  onClick={async () => {
                    let param = archivesForm.getFieldsValue()
                    if (type == "add") {
                      let res = await baseArchiveInsert(param);
                      message.success("添加成功")
                      setModalVisible(false);
                      refushList()
                    }
                    if (type == "edit") {
                      let res = await baseArchiveUpdate({ ...param, id: selectData.id });
                      message.success("修改成功")
                      setModalVisible(false);
                      refushList()
                    }
                  }}>{type == "add" ? "保存" : "修改"}</Button>
              </Form.Item>
            </Form>
          </Card>
        </>
      </Modal>
    );
  };

  return (
    <div className="archives">
      <div className="content">
        {renderSearch()}
        {renderForm()}
        {renderMoadl()}
      </div>
    </div>
  );
};

export default Archives;
