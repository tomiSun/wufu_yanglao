import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable, Seltopt } from 'yunyi-component';
import {
  Form,
  Modal,
  Input,
  Row,
  Col,
  Radio,
  InputNumber,
  message,
  Button,
  Divider,
  DatePicker,
  Checkbox,
  Rate,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
// import {
//   getBloodTableData,
//   delBloodTableData,
//   insertBloodType,
//   updateBloodType,
// } from '@/services/blood/bloodcomposition';
// import { getBasicData } from '@/services/basicData/basic';
import { findValByKey, getDefaultOption } from '@/utils/common';
import { makeWb, pinyin } from 'yunyi-convert';
import { config } from '@/utils/const';
const { pageSize, pageNum } = config;
import { useTableHeight } from '@/utils/tableHeight';
const { TextArea } = Input;
import { history } from 'umi';
export default () => {
  const [modalForm] = Form.useForm();
  const nextStep = async () => {
    const formData = await modalForm.validateFields();
    const { phone, name } = formData;
    console.log('formData: ', formData);
    history.push(`/directAccess/satisficing?phone=${phone}`);
  };
  return (
    <div className={styles.verifyUser}>
      <div className={styles.center}>
        <Form
          name="basic"
          layout="inline"
          form={modalForm}
          labelCol={{ flex: '90px' }}
          initialValues={{}}
        >
          <Row>
            <Col span={24} className={styles.col}>
              <Form.Item label="姓名" name="name" rules={[{ required: false, message: '' }]}>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={24} className={styles.col}>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" onClick={nextStep}>
            下一步
          </Button>
        </div>
      </div>
    </div>
  );
};
