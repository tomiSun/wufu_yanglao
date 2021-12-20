import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Table, Radio, Input, Modal, message, Pagination } from 'antd';
import { dataSource, columns } from './data';
import { dictDateSelect } from '@/services/basicSetting/dictionary';
import {
  baseArchiveDel,
  baseArchiveQuery,
  baseArchiveUpdate,
  baseArchiveInsert,
} from '@/services/archives';
import './index.less';
const layout = (x, y, labelAlign, layout) => {
  return {
    labelCol: { span: x },
    wrapperCol: { span: y },
    labelAlign,
    layout,
  };
};
const validateMessages = {
  required: '${label}必填！',
};

const Archives = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  const [archivesForm] = Form.useForm();
  const [SFrom] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const [dictionaryMap, setDictionaryMap] = useState({ '0010': [] });
  const [type, setType] = useState('add');
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
  });
  useEffect(() => {
    refushList(pageInfo);
    getDictDataSelect(['0010']); //过敏史
  }, []);
  const refushList = async (pageParam) => {
    let param = SFrom.getFieldsValue();
    let pageInfoCopy = { ...pageInfo, ...pageParam };
    let res = await baseArchiveQuery({
      ...param,
      pageSize: pageInfoCopy.pageSize,
      pageNum: pageInfoCopy.pageNum,
    });
    setDataSource(res['data']['list']);
    setPageInfo({ ...pageInfoCopy, total: res.data.total });
  };
  //获取字典
  const getDictDataSelect = async (dList) => {
    let resMap = {};
    for (const [idx, it] of dList.entries()) {
      let param = { pageNum: 1, pageSize: 20, typeCode: String(it) };
      const res = await dictDateSelect(param);
      let key = param['typeCode'];
      resMap[key] = res['data']['list'];
      if (idx == dList.length - 1) {
        setDictionaryMap(resMap);
      }
    }
  };
  const renderSearch = () => {
    return (
      <Form {...layout(8, 16, 'left', 'inline')} form={SFrom}>
        <Form.Item label="姓名" name={'name'}>
          <Input
            width="200"
            size={'small'}
            allowClear
            onPressEnter={() => {
              refushList();
            }}
          />
        </Form.Item>
        <Form.Item label="档案ID" name={'archiveId'}>
          <Input
            width="200"
            size={'small'}
            allowClear
            onPressEnter={() => {
              refushList();
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            onClick={async () => {
              refushList({ pageNum: 1 });
            }}
          >
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              setModalVisible(true);
              setType('add');
            }}
          >
            新增
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //操作
  const editButton = (row) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          size={'small'}
          type="link"
          onClick={() => {
            setType('edit');
            setSelectData(row);
            archivesForm.setFieldsValue(row);
            setModalVisible(true);
          }}
          size="small"
        >
          编辑
        </Button>
        <Button
          size={'small'}
          type="link"
          onClick={async () => {
            let res = await baseArchiveDel({ id: row['id'] });
            message.success('删除成功');
            refushList({ pageNum: 1 });
          }}
          size="small"
        >
          删除
        </Button>
      </div>
    );
  };
  //表单
  const renderForm = () => {
    return (
      <>
        <Table
          className="comomnTable"
          scroll={{ x: 1600 }}
          columns={columns(editButton, dictionaryMap)}
          dataSource={dataSource}
          pagination={false}
        />
        <Pagination
          defaultCurrent={1}
          current={pageInfo['pageNum']}
          defaultPageSize={pageInfo['pageSize']}
          total={pageInfo['total']}
          onChange={(page, pageSize) => {
            setPageInfo({ total: pageInfo.total, pageNum: page, pageSize });
            refushList({ total: pageInfo.total, pageNum: page, pageSize });
          }}
          style={{ position: 'absolute', bottom: 35, right: 50 }}
        />
      </>
    );
  };
  //根据身份证号 计算年龄

  const hanleAge = (UUserCard) => {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (
      UUserCard.substring(10, 12) < month ||
      (UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day)
    ) {
      age++;
    }
    return age;
  };
  //弹窗
  const renderMoadl = () => {
    return (
      <Modal
        title="老人档案"
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          archivesForm.resetFields();
        }}
        onCancel={() => {
          setModalVisible(false);
          archivesForm.resetFields();
        }}
        footer={null}
      >
        <>
          <Card title="基本信息" style={{ width: '80%' }} bordered={false}>
            <Form
              {...layout(8, 16)}
              name="nest-messages"
              validateMessages={validateMessages}
              form={archivesForm}
            >
              <Form.Item name={'name'} label="姓名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'sex'} label="性别" initialValue={'1'} rules={[{ required: true }]}>
                <Radio.Group defaultValue={'1'}>
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'2'}>女</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name={'idCard'} label="身份证号" rules={[{ required: true }]}>
                <Input
                  onBlur={(value) => {
                    let age = hanleAge(value.target.value);
                    archivesForm.setFieldsValue({ age: age });
                  }}
                />
              </Form.Item>
              <Form.Item name={'age'} label="年龄" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'guardianName'} label="联系人姓名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name={'guardianIdCard'}
                label="联系人身份证号"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name={'relation'} label="关系" initialValue={'0001'}>
                {/* <Select style={{ width: "100%" }} defaultValue="0001">
                  {dictionaryMap?.['0010'].map(item => {
                    return <Option value={item['dictCode']} >{item['dictName']}</Option>
                  })}
                </Select> */}
                <Input />
              </Form.Item>
              <Form.Item name={'contactNumber'} label="联系电话" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'contactAddress'} label="家庭住址">
                <Input.TextArea />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ marginLeft: 200 }}
                  type={'primary'}
                  onClick={async () => {
                    let param = archivesForm.getFieldsValue();
                    if (type == 'add') {
                      let res = await baseArchiveInsert(param);
                      message.success('添加成功');
                      setModalVisible(false);
                      archivesForm.resetFields();
                      refushList();
                    }
                    if (type == 'edit') {
                      let res = await baseArchiveUpdate({ ...param, id: selectData.id });
                      message.success('修改成功');
                      setModalVisible(false);
                      archivesForm.resetFields();
                      refushList();
                    }
                  }}
                >
                  {type == 'add' ? '保存' : '修改'}
                </Button>
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
