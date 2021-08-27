import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Row,
  Select,
  Table,
  Radio,
  Input,
  DatePicker,
  TimePicker,
  Tabs,
  Checkbox,
  Col,
  message,
} from 'antd';
import { BedTreeSelect } from '@/components/BedTreeSelect';
import styles from './index.less';
import { columns, dataSource } from './config';
import { history, useLocation } from 'umi';
import { dictDateSelect } from '@/services/basicSetting/dictionary';
import {
  bloodSugarUpdate,
  bloodSugarInsert,
  updateSpecialNursing,
  addSpecialNursing,
  addNursingRecord,
  updateNursingRecord,
  addVitalSignRecord,
  updateVitalSignRecord,
  //记录
  pageNursingRecord,
  bloodSugarQuery,
  pageSpecialNursing,
  pageVitalSignRecord,
} from '@/services/nursingManagement';
import { queryHospitalRegist } from '@/services/inHospitalRegister';
const { TabPane } = Tabs;
import { ULayout } from '@/utils/common';
import moment from 'moment';

const validateMessages = {
  required: '${label} 为必填项',
};

const NursingAddRecord = (props) => {
  const { query } = useLocation();
  const [SForm] = Form.useForm();
  const { selectKey, type, businessNo, recordId } = query;
  //选中的行
  const [selectRowId, setSelectRowId] = useState('');
  //护理
  const [nursingForm] = Form.useForm();
  //血糖
  const [bloodForm] = Form.useForm();
  //特级护理
  const [specialNursingForm] = Form.useForm();
  //三测单
  const [threeVolumeForm] = Form.useForm();
  //tab页 key
  const [tabKey, setTabKey] = useState(selectKey || '1');
  //当前页面的状态
  const [ftype, setFtype] = useState(type);
  //字典
  const [dictionaryMap, setDictionaryMap] = useState({ '0006': [], '0014': [], '0011': [] });
  //用户信息
  const [record, setRecord] = useState([]);
  //用户信息
  const [nursingRecord, setRnursingRecord] = useState([]);
  //用户信息
  const [recordList, setRecordList] = useState([]);
  //用户选择的楼宇信息
  const [SRoomInfo, setSRoomInfo] = useState({});
  //初始化状态
  const initStateValue = () => {
    setFtype('add');
    nursingForm.resetFields();
    bloodForm.resetFields();
    specialNursingForm.resetFields();
    threeVolumeForm.resetFields();
  };
  //获取字典
  useEffect(() => {
    let param = { pageSize: 10, pageNum: 1, status: '0' };
    //获取字典
    getDictDataSelect(['0006', '0014', '0011']); //过敏史
    if (type == 'edit') {
      param['businessNo'] = businessNo;
      getRecordInfoById();
      getPeopleInfoList({ businessNo, pageNum: 1, pageSize: 10 });
    }
    getPeopleInfoList(param); //查询url上的人员信息
  }, []);
  //查询护理记录
  const getRecordInfoById = async () => {
    let mapApi = {
      1: pageNursingRecord,
      2: pageVitalSignRecord,
      3: bloodSugarQuery,
      4: pageSpecialNursing,
    };
    let formMap = {
      1: nursingForm,
      2: threeVolumeForm,
      3: bloodForm,
      4: specialNursingForm,
    };
    let res = await mapApi[selectKey]({ id: recordId });
    let data = res?.data?.list && res?.data?.list.length > 0 && res?.data?.list[0];
    setRnursingRecord(data);
    formMap[selectKey].setFieldsValue({
      ...data,
      recordTime: moment(data['recordTime'] || new Date()),
      createTime: moment(data['createTime'] || new Date()),
      samplingTime: moment(data['samplingTime'] || new Date()),
      bloodSugarRecordDate: moment(data['bloodSugarRecordDate'] || new Date()),
      nursingTime: moment(data['nursingTime'] || new Date()),
    });
  };
  //查询人员列表
  const getPeopleInfoList = async (param) => {
    let res = await queryHospitalRegist(param);
    setRecordList(res['data']['list']);
  };
  //刷新人员列表
  const refushPeopleInfoList = async () => {
    let param = { ...SForm.getFieldsValue(), ...SRoomInfo, pageNum: 1, pageSize: 1000, status: 0 };
    getPeopleInfoList(param);
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
  // 搜索部分
  const renderSearch = () => {
    return (
      <Form onFinish={() => {}} {...ULayout(8, 16, 'left', 'inline')} form={SForm}>
        <Form.Item label="姓名" name={'name'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} allowClear />
        </Form.Item>
        <Form.Item label="住院号" name={'businessNo'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} allowClear />
        </Form.Item>
        <Form.Item label="床位号" name={'bedCodeKey'}>
          <BedTreeSelect
            style={{ width: 300 }}
            onSelect={(value, node) => {
              let data = {
                bedCode: node?.bedCode,
                buildingCode: node?.buildingCode,
                floorCode: node?.floorCode,
                roomCode: node?.roomCode,
              };
              setSRoomInfo(data);
            }}
          />
        </Form.Item>
        {/* <Form.Item label="护理等级" name={'time'}>
                    <Select style={{ width: "100%" }} style={{ width: 150 }}>
                        {dictionaryMap?.['0011'].map(item => {
                            return <Option value={item['dictCode']}>{item['dictName']}</Option>
                        })}
                    </Select>
                </Form.Item> */}
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              refushPeopleInfoList();
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
              SForm.resetFields();
            }}
          >
            清空
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //人员信息
  const renderPeopleInfo = () => {
    return (
      <Table
        columns={columns()}
        dataSource={recordList}
        rowClassName={(record, index) => {
          return record['businessNo'] == selectRowId ? styles['rowSelect'] : styles['row'];
        }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              initStateValue();
              if (selectRowId == record['businessNo']) {
                console.log(event);
                setSelectRowId('');
                setRecord([]);
              }
              console.log(event);
              setSelectRowId(record['businessNo']);
              setRecord(record);
            }, // 点击行
          };
        }}
      />
    );
  };
  //护理项目
  const renderNursingItem = () => {
    return (
      <Form {...ULayout(8, 16)} style={{ width: '80%'}} form={nursingForm}>
        <Form.Item label="日期" name={'recordTime'} initialValue={moment(new Date())}>
          <DatePicker style={{ width: '100%' }} size={'small'} />
        </Form.Item>
        <Form.Item label="时间段" name={'timePoint'} initialValue={'0001'}>
          <Select style={{ width: '100%' }} defaultValue="0001">
            {dictionaryMap?.['0014'].map((item) => {
              return <Option value={item['dictCode']}>{item['dictName']}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item label="体温" name={'temperature'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="°C" />
        </Form.Item>
        <Form.Item label="脉搏心率" name={'pulse'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
        </Form.Item>
        <Form.Item label="呼吸" name={'breathing'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
        </Form.Item>
        <Form.Item label="高压" name={'highBloodPressure'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="mmHg" />
        </Form.Item>
        <Form.Item label="低压" name={'lowBloodPressure'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="mmHg" />
        </Form.Item>
        <Form.Item label="是否打扫房间" name={'isCleanRoom'} initialValue={'0'}>
          <Radio.Group>
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否清洗便池" name={'isCleanToilet'} initialValue={'0'}>
          <Radio.Group>
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否洗头理发" name={'isHaircut'} initialValue={'0'}>
          <Radio.Group>
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否晾晒衣服" name={'isHangClothes'} initialValue={'0'}>
          <Radio.Group>
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否修剪指甲" name={'isManicure'} initialValue={'0'}>
          <Radio.Group>
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="是否进餐送餐" name={'isMeals'} initialValue={'0'}>
          <Radio.Group>
            <Radio value="0">是</Radio>
            <Radio value="1">否</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="身心观察记录" name={'physicalAndMentalStatus'}>
          <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={3} />
        </Form.Item>
        <Form.Item label="其他" name={'other'}>
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
                  if (!record['businessNo']) {
                    message.warn('请选中要添加的老人');
                    return;
                  }
                  let param = {
                    ...record,
                    ...nursingForm.getFieldsValue(),
                    patientName: record['name'],
                  };
                  let res = await addNursingRecord(param);
                  message.success('新增成功');
                }
                if (ftype == 'edit') {
                  let param = {
                    ...record,
                    ...nursingRecord,
                    ...nursingForm.getFieldsValue(),
                    id: recordId,
                    businessNo: businessNo,
                    patientName: record['name'],
                  };
                  let res = await updateNursingRecord(param);
                  message.success('修改成功');
                }
              }}
            >
              {ftype == 'add' ? '保存' : '修改'}
            </Button>
            {renderClear()}
          </div>
        </Form.Item>
      </Form>
    );
  };
  //血糖
  const bloodGlucoseRecord = () => {
    return (
      <Form onFinish={() => {}} {...ULayout(8, 16)} style={{ width: '80%' }} form={bloodForm}>
        <Form.Item label="采样状态" name={'samplingStatus'} initialValue={'0001'}>
          <Select style={{ width: '100%' }} defaultValue="0001">
            {dictionaryMap?.['0006'].map((item) => {
              return <Option value={item['dictCode']}>{item['dictName']}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item label="采样日期" name={'bloodSugarRecordDate'} initialValue={moment(new Date())}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="采样时间" name={'samplingTime'} initialValue={moment(new Date())}>
          <TimePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="采样签名" name={'samplingSignature'}>
          <Input size="small" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="血糖值(单位：mmol)" name={'bloodGlucoseValue'}>
          <Input size="small" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="医院诊断" name={'hospitalDiagnosis'}>
          <Input.TextArea AUTOCOMPLETE="OFF" size={'small'} rows={3} />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              size={'small'}
              style={{ position: 'relative', right: 0 }}
              onClick={async () => {
                if (ftype == 'add') {
                  if (!record['businessNo']) {
                    message.warn('请选中要添加的老人');
                    return;
                  }
                  let param = {
                    ...record,
                    ...bloodForm.getFieldsValue(),
                    patientName: record['name'],
                  };
                  let res = await bloodSugarInsert(param);
                  message.success('添加成功');
                }
                if (ftype == 'edit') {
                  let param = {
                    ...record,
                    ...bloodForm.getFieldsValue(),
                    id: recordId,
                    patientName: record['name'],
                  };
                  let res = await bloodSugarUpdate(param);
                  message.success('修改成功');
                }
              }}
            >
              {ftype == 'add' ? '保存' : '修改'}
            </Button>
            {renderClear()}
          </div>
        </Form.Item>
      </Form>
    );
  };
  //特级护理
  const specialNursingRecord = () => {
    return (
      <Form
        onFinish={() => {}}
        {...ULayout(8, 16)}
        style={{ width: '80%' }}
        form={specialNursingForm}
      >
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
                  if (!record['businessNo']) {
                    message.warn('请选中要添加的老人');
                    return;
                  }
                  if (!record['businessNo']) {
                    message.warn('请选中要添加的老人');
                  }
                  let param = {
                    ...record,
                    ...specialNursingForm.getFieldsValue(),
                    patientName: record['name'],
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
                  message.success('新增成功');
                }
                if (ftype == 'edit') {
                  let param = {
                    ...record,
                    ...specialNursingForm.getFieldsValue(),
                    id: recordId,
                    patientName: record['name'],
                  };
                  let res = await updateSpecialNursing(param);
                  message.success('编辑成功');
                }
              }}
            >
              {ftype == 'add' ? '保存' : '修改'}
            </Button>
            {renderClear()}
          </div>
        </Form.Item>
      </Form>
    );
  };
  //三测单
  const threeVolumeList = () => {
    return (
      <Form onFinish={() => {}} {...ULayout(8, 16)} style={{ width: '80%' }} form={threeVolumeForm}>
        <Form.Item label="护理日期" name={'recordTime'} initialValue={moment(new Date())}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="时间段" name={'timePoint'}>
          <Select style={{ width: '100%' }} defaultValue="0001">
            {dictionaryMap?.['0014'].map((item) => {
              return <Option value={item['dictCode']}>{item['dictName']}</Option>;
            })}
          </Select>
        </Form.Item>
        {/* <Form.Item label="手术后天数" name={'c'} >
                    <Input size="small" style={{ width: "100%" }} />
                </Form.Item> */}
        <Form.Item label="体温" name={'temperature'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="°C" />
        </Form.Item>
        <Form.Item label="脉搏心率" name={'pulse'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
        </Form.Item>
        <Form.Item label="呼吸" name={'breathing'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="次/分" />
        </Form.Item>
        <Form.Item label="高压" name={'highBloodPressure'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="mmHg" />
        </Form.Item>
        <Form.Item label="低压" name={'lowBloodPressure'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="mmHg" />
        </Form.Item>
        <Form.Item label="入量" name={'intake'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
        </Form.Item>
        <Form.Item label=" 出量" name={'output'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
        </Form.Item>
        <Form.Item label=" 小便" name={'urine'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
        </Form.Item>
        {/* <Form.Item label=" 大便" name={'k'}>
                    <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="ml" />
                </Form.Item> */}
        <Form.Item label=" 体重" name={'weight'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} addonAfter="Kg" />
        </Form.Item>
        <Form.Item label=" 血氧饱和度" name={'m'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} />
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              size={'small'}
              style={{ position: 'relative', right: 0 }}
              onClick={async () => {
                if (ftype == 'add') {
                  if (!record['businessNo']) {
                    message.warn('请选中要添加的老人');
                    return;
                  }
                  let param = {
                    ...record,
                    ...threeVolumeForm.getFieldsValue(),
                    patientName: record['name'],
                  };
                  let res = await addVitalSignRecord(param);
                  message.success('新增成功');
                }
                if (ftype == 'edit') {
                  let param = {
                    ...record,
                    ...threeVolumeForm.getFieldsValue(),
                    id: recordId,
                    patientName: record['name'],
                  };
                  let res = await updateVitalSignRecord(param);
                  message.success('编辑成功');
                }
              }}
            >
              {ftype == 'add' ? '保存' : '修改'}
            </Button>
            {renderClear()}
          </div>
        </Form.Item>
      </Form>
    );
  };
  //基本信息
  const renderSelectInfo = () => {
    return (
      <div>
        <h4 style={{ display: 'inline-block', marginRight: 40 }}>{`姓名：${
          record?.name || '-'
        }`}</h4>
        <h4 style={{ display: 'inline-block', marginRight: 40 }}>{`性别：${
          record?.sex === '1' ? '男' : '女' || '-'
        }`}</h4>
        <h4 style={{ display: 'inline-block', marginRight: 40 }}>{`床号：${
          record['buildingName'] || '#'
        }-${record['floorName'] || '#'}-${record['roomName'] || '#'}-${
          record['bedName'] || '#'
        }`}</h4>
        <h4 style={{ display: 'inline-block', marginRight: 40 }}>{`住院号：${
          record?.businessNo || '-'
        }`}</h4>
        <h4 style={{ display: 'inline-block', marginRight: 40 }}>{`年龄：${
          record?.age || '-'
        }`}</h4>
        <h4 style={{ display: 'inline-block', marginRight: 40 }}>{`电话号：${
          record?.contactNumber || '-'
        }`}</h4>
      </div>
    );
  };
  //清空按钮
  const renderClear = () => {
    return (
      <Button
        style={{ marginLeft: 10 }}
        onClick={() => {
          initStateValue();
        }}
        size={'small'}
      >
        清空
      </Button>
    );
  };

  return (
    <div className={styles['nursingAddRecord']}>
      <div className={styles['top']}>{renderSearch()}</div>
      <div className={styles['top']}>{renderSelectInfo()}</div>
      <div className={styles['content']}>
        <div className={styles['content-left']}>{renderPeopleInfo()}</div>
        <div className={styles['content-right']}>
          <Tabs
            defaultActiveKey="1"
            tabPosition={'left'}
            activeKey={tabKey}
            onChange={(key) => {
              setTabKey(key);
            }}
          >
            <TabPane tab="护理记录" key="1">
              <div className={styles['addRecordBox']}>{renderNursingItem()}</div>
            </TabPane>
            <TabPane tab="三测单" key="2">
              <div className={styles['addRecordBox']}>{threeVolumeList()}</div>
            </TabPane>
            <TabPane tab="血糖记录" key="3">
              <div className={styles['addRecordBox']}>{bloodGlucoseRecord()}</div>
            </TabPane>
            <TabPane tab="特级护理记录" key="4">
              <div className={styles['addRecordBox']}>{specialNursingRecord()}</div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NursingAddRecord;
