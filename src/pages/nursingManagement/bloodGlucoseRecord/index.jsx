/**
 * 血糖记录
 *  */
import './index.less';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Select,
  Table,
  Input,
  DatePicker,
  Modal,
  message,
  Pagination,
  TimePicker,
} from 'antd';
import { history } from 'umi';
import { columns } from './data';
import moment from 'moment';
import {
  bloodSugarDel,
  bloodSugarQuery,
  bloodSugarUpdate,
  bloodSugarInsert,
} from '@/services/nursingManagement';
import { dictDateSelect } from '@/services/basicSetting/dictionary';
import { ULayout, isOnePeople } from '@/utils/common';
//登记接口
import { patientQuery, queryHospitalRegist } from '@/services/inHospitalRegister';
//导出
import { excelExport } from '@/utils/ExcelExport';
const validateMessages = {
  required: '${label} 为必填项',
};
const RloodGlucoseRecord = (props) => {
  //列表数据
  const [dataSource, setDataSource] = useState([{ 1: 1 }]); //数据
  //弹窗
  const [modalVisible, setModalVisible] = useState(false);
  //血糖采样状态的字典
  const [samplingStatusMap, setSamplingStatusMap] = useState([]);
  //名字选项
  const [nameSelectList, setNameSelectList] = useState([]);
  //基本信息
  const [addBasicInfo, setAddBasicInfo] = useState(null);
  //血糖记录信息
  const [nursingRecord, setNursingRecord] = useState(null);
  // 新增&修改
  const [ftype, setFtype] = useState('add');
  //列表选中
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //列表选中
  const [selectedRowData, setSelectedRowData] = useState([]);
  //分页
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
  });
  //搜索的表单
  const [SForm] = Form.useForm();
  // 表单
  const [TForm] = Form.useForm();
  //初始化操作
  useEffect(() => {
    getBloodSugarInfo(pageInfo);
    //获取字典
    getDictDataSelect({ pageNum: 1, pageSize: 20, typeCode: '0006' });
  }, []);
  //获取血糖列表信息
  const getBloodSugarInfo = async (param) => {
    let res = await bloodSugarQuery(param);
    if (res['code'] === 200) {
      setDataSource(
        res['data']['list'].map((item) => {
          return { ...item, key: item.id };
        }),
      );
      setPageInfo({
        pageNum: param['pageNum'],
        pageSize: param['pageSize'],
        total: res.data.total,
      });
    } else {
      setDataSource([]);
    }
  };
  //刷新操作
  const refushList = (pageParam) => {
    let search = SForm.getFieldsValue();
    let pageInfoCopy = { ...pageInfo, ...pageParam, ...search };
    let startTime =
      search?.['startTime'] &&
      moment(search?.['startTime']).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    let endTime =
      search?.['endTime'] && moment(search?.['endTime']).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    let param = { ...SForm.getFieldsValue(), ...pageInfoCopy, startTime, endTime };
    getBloodSugarInfo(param);
  };
  //获取字典
  const getDictDataSelect = async (param) => {
    let res = await dictDateSelect(param);
    setSamplingStatusMap(res['data']['list']);
    SForm.setFieldsValue({ samplingStatus: '0001' });
  };

  // 搜索表单
  const renderSearch = () => {
    return (
      <Form onFinish={() => {}} {...ULayout(8, 16, 'left', 'inline')} form={SForm}>
        <Form.Item label="姓名" name={'patientName'}>
          <Input size={'small'} allowClear />
        </Form.Item>
        <Form.Item label="住院号" name={'businessNo'}>
          <Input size={'small'} allowClear />
        </Form.Item>
        <Form.Item label="开始日期" name={'startTime'}>
          <DatePicker size={'small'} allowClear />
        </Form.Item>
        <Form.Item label="结束日期" name={'endTime'}>
          <DatePicker size={'small'} allowClear />
        </Form.Item>
        <Form.Item style={{ marginLeft: 20 }}>
          <Button
            type="primary"
            size={'small'}
            style={{ marginTop: 4 }}
            onClick={() => {
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
            style={{ marginTop: 4 }}
            onClick={() => {
              handAdd();
            }}
          >
            新增
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            style={{ marginTop: 4 }}
            onClick={() => {
              SForm.resetFields();
            }}
          >
            清空
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            style={{ marginTop: 4 }}
            onClick={() => {
              let res = isOnePeople(selectedRowData);
              if (!res) {
                message.warn('一次导出一个人的信息');
                return;
              }
              excelExport({
                api: '/blood-sugar/export', //导出接口路径
                ids: selectedRowKeys.join(','), //勾选的行id数组集合
                fileName: '血糖记录', //导出文件名称
              });
            }}
          >
            导出
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //新增
  const handAdd = () => {
    TForm.resetFields();
    setModalVisible(true);
    setFtype('add');
  };
  //修改
  const handEdit = (data) => {
    setModalVisible(true);
    setFtype('edit');
    setNursingRecord(data);
    TForm.setFieldsValue({
      ...data,
      name: data.patientName,
      samplingTime: moment(data['samplingTime'] || new Date()),
      bloodSugarRecordDate: moment(data['bloodSugarRecordDate'] || new Date()),
    });
  };
  //操作
  const editButton = (record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          size={'small'}
          type="link"
          onClick={() => {
            handEdit(record);
          }}
        >
          修改
        </Button>
        <Button
          size={'small'}
          type="link"
          onClick={async () => {
            let res = await bloodSugarDel({ id: record['id'] });
            message.success('成功');
            refushList({ pageNum: 1 });
          }}
        >
          删除
        </Button>
      </div>
    );
  };
  //选中操作
  const onSelectChange = (selectedRowKeys, record) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRowData(record);
  };
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange,
  };
  //表单
  const renderForm = () => {
    return (
      <div>
        <Table
          columns={columns(editButton, samplingStatusMap)}
          dataSource={dataSource}
          scroll={{ x: 1300 }}
          pagination={false}
          rowSelection={rowSelection}
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
      </div>
    );
  };
  //姓名搜索框
  const nameSelectChange = async (value) => {
    let res = await queryHospitalRegist({
      businessNo: value,
      pageSize: 1000,
      pageNum: 1,
      status: 0,
    });
    if (res?.data?.list[0]) {
      let data = res?.data?.list[0];
      let r = data;
      let bedName = `${r['buildingName'] || '#'}-${r['floorName'] || '#'}-${r['roomName'] || '#'}-${
        r['bedName'] || '#'
      }`;
      TForm.setFieldsValue({ ...data, bedName });
      setAddBasicInfo({ ...data }); //todo 少了诊断
    }
  };
  //姓名搜索框
  const nameSelectBlur = async (e, data) => {
    let res = await patientQuery({ keyWords: e });
    if (!!res['data']) {
      let data = res['data'].map((item) => {
        return { label: `${item['name']}-${item['businessNo']}`, value: item['businessNo'] };
      });
      setNameSelectList(data);
    } else {
      setNameSelectList([]);
    }
  };
  //弹窗
  const renderMoadl = () => {
    return (
      <Modal
        title="血糖管理"
        width={680}
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        footer={null}
      >
        <div style={{ paddingTop: 20, paddingLeft: 40, paddingRight: 40 }}>
          <Form
            form={TForm}
            {...ULayout(8, 16)}
            style={{ marginTop: 20 }}
            validateMessages={validateMessages}
          >
            <Form.Item label="姓名:" name={'name'} rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="姓名"
                onSearch={nameSelectBlur}
                onSelect={(value) => {
                  nameSelectChange(value);
                }}
                options={nameSelectList}
                filterOption={(inputValue, option) => {
                  return option.label.indexOf(inputValue) > -1;
                }}
              ></Select>
            </Form.Item>
            <Form.Item label="住院号" name={'businessNo'} rules={[{ required: true }]}>
              <Input size={'small'} allowClear disabled={true} />
            </Form.Item>
            <Form.Item label="床号" name={'bedName'} rules={[{ required: true }]}>
              <Input size={'small'} allowClear disabled={true} />
            </Form.Item>
            <Form.Item
              label="采样状态"
              name={'samplingStatus'}
              initialValue={'0001'}
              rules={[{ required: true }]}
            >
              <Select style={{ width: '100%' }} defaultValue="0001">
                {samplingStatusMap.map((item) => {
                  return <Option value={item['dictCode']}>{item['dictName']}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="采样日期"
              name={'bloodSugarRecordDate'}
              initialValue={moment(new Date())}
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="采样时间"
              name={'samplingTime'}
              initialValue={moment(new Date())}
              rules={[{ required: true }]}
            >
              <TimePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="采样签名" name={'samplingSignature'}>
              <Input size="small" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="血糖值(单位：mmol)"
              name={'bloodGlucoseValue'}
              rules={[{ required: true }]}
            >
              <Input size="small" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="医院诊断" name={'hospitalDiagnosis'}>
              <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={3} />
            </Form.Item>
          </Form>
          <Form.Item>
            <Button
              style={{ marginLeft: 200 }}
              type={'primary'}
              onClick={async () => {
                let param = TForm.getFieldsValue();
                if (ftype == 'add') {
                  let params = {
                    ...addBasicInfo,
                    ...TForm.getFieldsValue(),
                    patientName: addBasicInfo['name'],
                  };
                  let res = await bloodSugarInsert(params);
                  message.success('添加成功');
                  setModalVisible(false);
                  refushList({ pageNum: 1 });
                }
                if (ftype == 'edit') {
                  let param = {
                    ...nursingRecord,
                    ...TForm.getFieldsValue(),
                    patientName: nursingRecord['name'],
                  };
                  let res = await bloodSugarUpdate(param);
                  message.success('修改成功');
                  setModalVisible(false);
                  refushList({ pageNum: 1 });
                }
              }}
            >
              {ftype == 'add' ? '保存' : '修改'}
            </Button>
          </Form.Item>
        </div>
      </Modal>
    );
  };
  return (
    <div class="root">
      <div class="content">
        {renderSearch()}
        {renderForm()}
        {renderMoadl()}
      </div>
    </div>
  );
};

export default RloodGlucoseRecord;
