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
  Tabs,
  message,
  Pagination,
  Modal,
  Radio,
} from 'antd';
import { history } from 'umi';
import { columns } from './data';
import moment from 'moment';
import {
  delSpecialNursing,
  pageSpecialNursing,
  updateSpecialNursing,
  addSpecialNursing,
} from '@/services/nursingManagement';
import { dictDateSelect } from '@/services/basicSetting/dictionary';
import { ULayout } from '@/utils/common';
//登记接口
import { patientQuery, queryHospitalRegist } from '@/services/inHospitalRegister';
//导出 打印
import { excelExport, openModal } from '@/utils/ExcelExport';
const validateMessages = {
  required: '${label} 为必填项',
};

const DICT_LSIT = { '0006': [], '0015': [] };
const DICT_ARR = ['0006', '0015'];
const RloodGlucoseRecord = (props) => {
  //列表数据
  const [dataSource, setDataSource] = useState([{ 1: 1 }]); //数据
  //搜索的表单
  const [SForm] = Form.useForm();
  //信息表单
  const [TForm] = Form.useForm();
  //弹窗
  const [modalVisible, setModalVisible] = useState(false);
  //名字选项
  const [nameSelectList, setNameSelectList] = useState([]);
  //基本信息
  const [addBasicInfo, setAddBasicInfo] = useState(null);
  //血糖记录信息
  const [specialRecord, setSpecialRecord] = useState(null);
  // 新增&修改
  const [ftype, setFtype] = useState('add');
  //列表选中
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //字典
  const [dictionaryMap, setDictionaryMap] = useState(DICT_LSIT);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
  });
  //初始化操作
  useEffect(() => {
    getBloodSugarInfo(pageInfo);
    //获取字典
    getDictDataSelect(DICT_ARR); //过敏史
  }, []);

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

  //获取血糖列表信息
  const getBloodSugarInfo = async (param) => {
    let res = await pageSpecialNursing(param);
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
  const refushList = (pageParam = {}) => {
    let search = SForm.getFieldsValue();
    let pageInfoCopy = { ...pageInfo, ...pageParam };
    let startTime =
      search?.['startTime'] &&
      moment(search?.['startTime']).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    let endTime =
      search?.['endTime'] && moment(search?.['endTime']).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    let param = { ...SForm.getFieldsValue(), ...pageInfoCopy, startTime, endTime };
    getBloodSugarInfo(param);
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
              refushList();
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
            新增记录
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
              openModal({
                url: '/jmreport/view/655304448950456320', //拼接后的报表地址
              });
              // excelExport({
              //   api: '/nursingManage/exportSpecialNursing', //导出接口路径
              //   ids: selectedRowKeys.join(','), //勾选的行id数组集合
              //   fileName: '特级护理记录', //导出文件名称
              // });
            }}
          >
            打印
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
    setSpecialRecord(data);
    TForm.setFieldsValue({
      ...data,
      name: data.patientName,
      createTime: moment(data['createTime'] || new Date()),
      nursingTime: moment(data['nursingTime'] || new Date()),
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
            let res = await delSpecialNursing({ id: record['id'] });
            message.success('成功');
            refushList();
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
          columns={columns(editButton, dictionaryMap)}
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
        title="特级护理管理"
        width={500}
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
            <Form.Item label="护理时间" name={'nursingTime'} initialValue={moment(new Date())}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="是否晚间护理" name={'isEveningCare'}>
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="是否晨间护理" name={'isMorningCare'}>
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="是否有过敏史" name={'allergy'}>
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="预防压疮护理" name={'isPressureUlcersCare'}>
              <Radio.Group>
                <Radio value="0">是</Radio>
                <Radio value="1">否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="出量记录" name={'output'}>
              <Input size="small" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="入量记录" name={'input'}>
              <Input size="small" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="责任人" name={'personInCharge'}>
              <Input AUTOCOMPLETE="OFF" size={'small'} />
            </Form.Item>
            <Form.Item label="医院诊断" name={'hospitalDiagnosis'}>
              <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={3} />
            </Form.Item>
            <Form.Item label="精神状态及其他" name={'mentalState'}>
              <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={4} />
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  size={'small'}
                  style={{ position: 'relative', right: 0 }}
                  onClick={async () => {
                    if (ftype == 'add') {
                      let param = {
                        ...addBasicInfo,
                        ...TForm.getFieldsValue(),
                        patientName: addBasicInfo['name'],
                      };
                      let params = {
                        allergy: param?.allergy,
                        bedName: param?.bedName || '#',
                        businessNo: param?.businessNo,
                        hospitalDiagnosis: param?.hospitalDiagnosis,
                        input: param?.input,
                        isEveningCare: param?.isEveningCare,
                        isMorningCare: param?.isMorningCare,
                        isPressureUlcersCare: param?.isPressureUlcersCare,
                        mentalState: param?.mentalState,
                        nursingTime: param?.nursingTime,
                        output: param?.output,
                        patientName: param?.name,
                        personInCharge: param?.personInCharge,
                        roomName: param?.roomName || '#',
                      };
                      let res = await addSpecialNursing(params);
                      setModalVisible(false);
                      refushList();
                      message.success('新增成功');
                    }
                    if (ftype == 'edit') {
                      let param = {
                        ...specialRecord,
                        ...TForm.getFieldsValue(),
                        patientName: specialRecord['name'],
                      };
                      let res = await updateSpecialNursing(param);
                      setModalVisible(false);
                      refushList();
                      message.success('编辑成功');
                    }
                  }}
                >
                  {ftype == 'add' ? '保存' : '修改'}
                </Button>
              </div>
            </Form.Item>
          </Form>
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
