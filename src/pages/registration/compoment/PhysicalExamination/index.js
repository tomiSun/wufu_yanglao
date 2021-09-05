/**试用期评估 */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Tabs,
  message,
} from 'antd';
import {
  examArchiveDel,
  examArchiveQuery,
  examArchiveUpdate,
  examArchiveSave,
} from '@/services/inHospitalRegister/index.js';
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
  const [form] = Form.useForm(); //基础与总结
  const [updateId, setUpdateId] = useState('');

  useEffect(() => {
    initData();
  }, []);
  //初始化 判断是新增还是编辑
  const initData = async () => {
    form.setFieldsValue(selectRowData);
    let resQuery = await examArchiveQuery({ businessNo: selectRowData['businessNo'] });
    if (resQuery['code'] == 200 && !!resQuery['data']) {
      //todo
      let id = resQuery['data']['busExamArchiveQueryVO']['id'];
      setUpdateId(id);
      setMode('edit');
    } else {
      setMode('add');
    }
  };
  //清除
  const formReset = () => {
    form.resetFields();
  };
  //体检弹窗
  const renderModal = () => {
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
      >
        <Form
          style={{ width: 500, margin: 10 }}
          form={form}
          {...layout}
          name="nest-messages"
          validateMessages={validateMessages}
        >
          <Form.Item name={'archiveId'} label="档案ID" {...layout}>
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  const renderBtnArea = () => {
    //新增按钮
    let addBtn = (
      <Button
        onClick={async () => {
          let addParam = {
            busExamArchiveInsertPO: form.getFieldsValue(),
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
            busExamArchiveUpdatePO: { ...form.getFieldsValue(), id: updateId },
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
  return <div>{renderModal
    ()}</div>;
};

export default PhysicalExamination;
