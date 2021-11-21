import './index.less';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Select,
  Table,
  Radio,
  Input,
  DatePicker,
  Modal,
  message,
  Pagination,
} from 'antd';
import { columns } from './data';
import PhysicalExamination from '../compoment/PhysicalExamination/index';
import ProbationEvaluation from '../compoment/ProbationEvaluation';
import Assessment from '../compoment/Assessment';
import AgreementForm from '../compoment/AgreementForm';
import RiskNotificationForm from '../compoment/RiskNotificationForm';
//登记接口
import {
  addHospitalRegist,
  queryHospitalRegist,
  outHospitalRegist,
  updateHospitalRegist,
  patientQuery,
  queryBed,
} from '@/services/inHospitalRegister';
import { baseArchiveQuery } from '@/services/archives';
//床位信息接口
import { dictDateSelect } from '@/services/basicSetting/dictionary';
import moment from 'moment';
import { ULayout } from '@/utils/common';

const DICT_LSIT = { '0008': [], '0009': [], '0010': [], '0011': [], '0015': [] };
const DICT_ARR = ['0008', '0009', '0010', '0011', '0015','0003'];
const validateMessages = {
  required: '${label} is required!',
};
const InHospitalRegister = (props) => {
  const [registForm] = Form.useForm();
  const [registOutForm] = Form.useForm();
  const [SForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  const [modalOutVisible, setModalOutVisible] = useState(false); //出院办理
  const [dictionaryMap, setDictionaryMap] = useState(DICT_LSIT);
  const [selectData, setSelectData] = useState([]);
  const [physicalExaminationVisible, setPhysicalExaminationVisible] = useState(false); //体检的弹窗
  const [probationEvaluationVisible, setProbationEvaluationVisible] = useState(false); //试用期评估
  const [assessmentVisible, setAssessmentVisible] = useState(false); //入院评估
  const [agreementFormVisible, setAgreementFormVisible] = useState(false); //合同
  const [riskNotificationFormVisible, setRiskNotificationFormVisible] = useState(false); //分险告知书
  const [selectRowData, setSelectRowData] = useState([]); //选择的行
  const [bedList, setBedList] = useState([]); //床位号
  const [roomInfo, setRoomInfo] = useState(); //房间信息
  const [nameSelectList, setNameSelectList] = useState([]); //复合搜索的人的集合
  const [addBasicInfo, setAddBasicInfo] = useState({}); //选中的人员信息
  const [mode, setMode] = useState('add');
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
  });
  useEffect(() => {
    //获取字典
    getDictDataSelect(DICT_ARR); //过敏史
    nameSelectBlur('');
  }, []);

  useEffect(() => {
    let param = { ...pageInfo, status: 0 };
    getHospitalRegistList(param);
  }, []);

  useEffect(() => {
    handleRoomInit();
  }, [modalVisible])
  //获取列表信息
  const getHospitalRegistList = async (param) => {
    let res = await queryHospitalRegist(param);
    setDataSource(res['data']['list']);
    setPageInfo({
      pageSize: param.pageSize,
      pageNum: param.pageNum,
      total: res.data.total,
    });
  };

  //获取信息
  const refushList = (pageParam) => {
    let data = SForm.getFieldsValue();
    let pageInfoCopy = { ...pageInfo, ...pageParam };
    let param = {
      ...data,
      pageSize: pageInfoCopy.pageSize,
      pageNum: pageInfoCopy.pageNum,
      status: 0,
    };
    getHospitalRegistList(param);
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
      <div>
        <Form onFinish={() => { }} {...ULayout(8, 16, 'left', 'inline')} form={SForm}>
          <Form.Item label="姓名" name={'name'}>
            <Input size={'small'} allowClear />
          </Form.Item>
          <Form.Item label="住院号" name={'businessNo'}>
            <Input size={'small'} allowClear />
          </Form.Item>
          {/* <Form.Item label="入院日期" name={"name"}>
                        <DatePicker size={'small'} />
                    </Form.Item> */}
          <Form.Item>
            <Button
              type="primary"
              size={'small'}
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
              onClick={() => {
                setMode('add');
                registForm.resetFields()
                setModalVisible(true);
              }}
            >
              新增
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  // 处理编辑基本信息
  const handleEdit = (row) => {
    setSelectData(row);
    setMode('edit');
    let data = {
      ...row,
      admissionTime: moment(row['admissionTime'] || new Date()),
      feesDueDate: moment(row['feesDueDate'] || new Date()),
      // roomKey: row['roomCode'],
      bedCodeKey: `${row['buildingCode']}-${row['floorCode']}-${row['roomCode']}-${row['bedCode']}`,
    };
    registForm.setFieldsValue(data);
    setRoomInfo({
      buildingCode: row['buildingCode'],
      floorCode: row['floorCode'],
      roomCode: row['roomCode'],
      bedCode: row['bedCode'],
      buildingName: row['buildingName'],
      floorName: row['floorName'],
      roomName: row['roomName'],
      bedName: row['bedName'],
    });
    setModalVisible(true);
  };
  //退院
  const handleOutHospitalRegist = async (row) => {
    let res = await outHospitalRegist({
      businessNo: row['businessNo'],
      peopleTo: registOutForm.getFieldsValue().peopleTo,
    });
    message.success('退院成功');
    refushList(pageInfo);
  };
  //操作
  const editButton = (row) => {
    return (
      <div>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type="link"
          onClick={() => {
            handleEdit(row);
          }}
        >
          编辑
        </Button>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type="link"
          onClick={() => {
            setSelectRowData(row);
            setPhysicalExaminationVisible(true);
          }}
        >
        </Button>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type="link"
          onClick={() => {
            setSelectRowData(row);
            setPhysicalExaminationVisible(true);
          }}
        >
          体检报告
        </Button>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type="link"
          onClick={() => {
            setSelectRowData(row);
            setAssessmentVisible(true);
          }}
        >
          入住评估
        </Button>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type="link"
          onClick={() => {
            setSelectRowData(row);
            setProbationEvaluationVisible(true);
          }}
        >
          试用期评估
        </Button>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type="link"
          onClick={() => {
            setSelectRowData(row);
            setAgreementFormVisible(true);
          }}
        >
          合同
        </Button>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type="link"
          onClick={() => {
            setSelectRowData(row);
            setRiskNotificationFormVisible(true);
          }}
        >
          风险告知书
        </Button>
        <Button
          style={{ marginRight: 10 }}
          size={'small'}
          type={'link'}
          onClick={() => {
            setSelectRowData(row);
            setModalOutVisible(true);
            registOutForm.setFieldsValue({ peopleTo: '1' });
          }}
        >
          办理出院
        </Button>
      </div>
    );
  };
  //表单
  const renderForm = () => {
    return (
      <>
        <Table
          columns={columns(editButton, dictionaryMap)}
          dataSource={dataSource}
          scroll={{ x: 1900 }}
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

  const handleRoomInit = async (value, v2) => {
    //bedRoomQuery,
    let res = await queryBed({ keyWords: '' });
    let resData = res['data'];
    let list = resData?.map((item) => {
      return {
        label: `${item['buildingName'] || '#'}-${item['floorName'] || '#'}-${item['roomName'] || '#'
          }-${item['bedName'] || '#'}`,
        value: `${item['buildingCode']}-${item['floorCode']}-${item['roomCode']}-${item['bedCode']}`,
        disabled: item['status'] === "1",
      };
    });
    setBedList(list || []);
    registForm.setFieldsValue({ bedCode: '' });
  };
  //姓名搜索框
  const nameSelectChange = async (value) => {
    let res = await baseArchiveQuery({ archiveId: value, pageSize: 10, pageNum: 1 });
    if (res?.data?.list[0]) {
      let data = res?.data?.list[0];
      setAddBasicInfo({ ...data, archiveId: data.id });
      registForm.setFieldsValue({ ...data, relationName: data.guardianName });
    }
  };
  //姓名搜索框
  const nameSelectBlur = async (e, data) => {
    let res = await baseArchiveQuery({ name: e, pageSize: 10, pageNum: 1 });
    if (!!res['data']) {
      let data = res['data']['list'].map((item) => {
        return { label: item['name'], value: item['id'] };
      });
      setNameSelectList(data);
    } else {
      setNameSelectList([]);
    }
  };
  //入院弹窗
  const renderMoadl = () => {
    return (
      <Modal
        title="入科登记"
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          registForm.resetFields();
        }}
        onCancel={() => {
          setModalVisible(false);
          registForm.resetFields();
        }}
        style={{ width: 500 }}
        footer={renderBtnArea()}
      >
        <>
          <Form
            {...ULayout(8, 16)}
            form={registForm}
            name="nest-messages"
            validateMessages={validateMessages}
            style={{ marginRight: 60, marginTop: 20 }}
          >
            <Form.Item name={'name'} label="姓名" required>
              <Select
                showSearch
                placeholder="姓名"
                onSearch={nameSelectBlur}
                onChange={(value) => {
                  nameSelectChange(value);
                }}
                options={nameSelectList}
                filterOption={(inputValue, option) => {
                  return option.label.indexOf(inputValue) > -1;
                }}
              ></Select>
            </Form.Item>
            <Form.Item name={'sex'} label="性别" rules={[{ required: true }]} initialValue={'1'}>
              <Radio.Group defaultValue={'1'}>
                <Radio value={'1'}>男</Radio>
                <Radio value={'2'}>女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name={'age'} label="年龄" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            {/* <Form.Item
                        name={'roomKey'}
                        label="房间号"
                        initialValue={"1"}
                        rules={[{ required: true }]}
                    >
                        <BedTreeSelect
                            onSelect={handleRoomChange}
                            onChange={() => {
                            }}
                            style={{ width: '100%' }}
                        />
                    </Form.Item> */}
            {/* <Form.Item
                        name={'bedCodeKey'}
                        label="床位号"
                        rules={[{ required: true }]}
                    >
                        <Select
                        >
                            {bedList.length > 0 && bedList.map(item => {
                                return <Option
                                    value={`${item['bedCode']}`} data={item}>{item['name']}</Option>
                            })}
                        </Select>
                    </Form.Item> */}
            {/* 方案二 下拉框 */}
            <Form.Item name={'bedCodeKey'} label="床位号" rules={[{ required: true }]}>
              <Select
                onChange={(value, record) => {
                  let item = value.split('-');
                  let itemName = record['label'].split('-');
                  setRoomInfo({
                    buildingCode: item[0],
                    floorCode: item[1],
                    roomCode: item[2],
                    bedCode: item[3],
                    buildingName: itemName[0],
                    floorName: itemName[1],
                    roomName: itemName[2],
                    bedName: itemName[3],
                  });
                }}
                options={bedList}
              >
                {bedList.length > 0 &&
                  bedList.map((item) => {
                    return (
                      <Option
                        value={`${item['buildingCode']}-${item['floorCode']}-${item['roomCode']}-${item['bedCode']}`}
                        data={item}
                      >
                        {item['name']}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
            <Form.Item
              name={'peopleFrom'}
              label="来源"
              initialValue={'1'}
              rules={[{ required: true }]}
            >
              <Select defaultValue={'1'}>
                {[
                  { name: '社会', value: '1' },
                  { name: '医院', value: '2' },
                ].map((item) => {
                  return (
                    <Option value={item['value']} data={item}>
                      {item['name']}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name={'nursingLevel'}
              label="护理级别"
              rules={[{ required: true }]}
              initialValue={'0001'}
            >
              <Select defaultValue="0001" onChange={() => { }}>
                {dictionaryMap?.['0011'].map((item) => {
                  return <Option value={item['dictCode']}>{item['dictName']}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item name={'hospitalDiagnosis'} label="入院诊断">
              <Input />
            </Form.Item>
            <Form.Item name={'admissionTime'} label="入院时间" initialValue={moment(new Date())}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={'feesDueDate'} label="费用到期时间" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={'allergy'} label="过敏史">
              {/* <Select
                mode="multiple"
                // defaultValue={["0001", "0002"]}
                onChange={() => { }}
              >
                {dictionaryMap?.['0008'].map((item) => {
                  return <Option value={item['dictCode']}>{item['dictName']}</Option>;
                })}
              </Select> */}
              <Input />
            </Form.Item>
            <Form.Item name={'previousHistory'} label="既往史">
              {/* <Select
                mode="multiple"
                // defaultValue={["0001", "0002"]}
                onChange={() => { }}
              >
                {dictionaryMap?.['0009'].map((item) => {
                  return <Option value={item['dictCode']}>{item['dictName']}</Option>;
                })}
              </Select> */}
              <Input />
            </Form.Item>
            <Form.Item name={'idCard'} label="身份证号" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={'relationName'} label="联系人姓名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={'relation'}
              label="关系"
              rules={[{ required: true }]}
              initialValue={'0001'}
            >
              {/* <Select defaultValue={'0001'} onChange={() => { }}>
                {dictionaryMap?.['0010'].map((item) => {
                  return <Option value={item['dictCode']}>{item['dictName']}</Option>;
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
            <Form.Item name={'contactAddress'} label="家庭住址">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </>
      </Modal>
    );
  };
  //出院
  const rendeOutrMoadl = () => {
    return (
      <Modal
        title="出院登记"
        visible={modalOutVisible}
        onOk={() => {
          setModalOutVisible(false);
        }}
        onCancel={() => {
          setModalOutVisible(false);
        }}
        style={{ width: 500 }}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              handleOutHospitalRegist(selectRowData);
              setModalOutVisible(false);
              registOutForm.resetFields();
            }}
          >
            办理出院
          </Button>,
        ]}
      >
        <>
          <Form
            {...ULayout(8, 16)}
            form={registOutForm}
            name="nest-messages"
            validateMessages={validateMessages}
            style={{ marginRight: 60, marginTop: 20 }}
          >
            <Form.Item name={'peopleTo'} label="流向">
              <Select defaultValue={'1'}>
                {[
                  { name: '社会', value: '1' },
                  { name: '医院', value: '2' },
                ].map((item) => {
                  return (
                    <Option value={item['value']} data={item}>
                      {item['name']}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </>
      </Modal>
    );
  };
  const renderBtnArea = () => {
    //新增按钮
    let addBtn = (
      <Button
        onClick={async () => {
          let addParam = {
            archiveId: addBasicInfo.archiveId,
            ...roomInfo,
            ...registForm.getFieldsValue(),
            status: '0',
          };
          let res = await addHospitalRegist(addParam);
          message.success('新增成功');
          refushList(pageInfo);
          setModalVisible(false);
        }}
      >
        保存
      </Button>
    );
    //编辑按钮
    let editBtn = (
      <Button
        type={'primary'}
        onClick={async () => {
          let updateParam = {
            ...roomInfo,
            ...registForm.getFieldsValue(),
            archiveId: selectData['archiveId'],
            id: selectData['id'],
          };
          let res = await updateHospitalRegist(updateParam);
          message.success('修改成功');
          refushList(pageInfo);
          setModalVisible(false);
        }}
      >
        修改
      </Button>
    );
    let arrEdit = [editBtn];
    let arrAdd = [addBtn];
    if (mode == 'edit') {
      return arrEdit;
    }
    if (mode == 'add') {
      return arrAdd;
    }
    return arrAdd;
  };
  return (
    <div class="archives">
      <div class="content">
        {renderSearch()}
        {renderForm()}
        {renderMoadl()}
        {rendeOutrMoadl()}
        {/* 体检*/}
        {physicalExaminationVisible && (
          <PhysicalExamination
            visible={physicalExaminationVisible}
            onPhysicalExaminationVisible={(flag) => {
              setPhysicalExaminationVisible(flag);
            }}
            selectRowData={selectRowData}
          />
        )}
        {/* 试用期评估*/}
        {probationEvaluationVisible && (
          <ProbationEvaluation
            visible={probationEvaluationVisible}
            onProbationEvaluationVisible={(flag) => {
              setProbationEvaluationVisible(flag);
            }}
            selectRowData={selectRowData}
          />
        )}
        {/* 试用期评估*/}
        {assessmentVisible && (
          <Assessment
            visible={assessmentVisible}
            onAssessmentVisible={(flag) => {
              setAssessmentVisible(flag);
            }}
            selectRowData={selectRowData}
          />
        )}
        {/* 合同 */}
        {agreementFormVisible && (
          <AgreementForm
            visible={agreementFormVisible}
            onAgreementFormVisibleVisible={(flag) => {
              setAgreementFormVisible(flag);
            }}
            selectRowData={selectRowData}
          />
        )}
        {/* 风险告知书 */}
        {riskNotificationFormVisible && (
          <RiskNotificationForm
            visible={riskNotificationFormVisible}
            onRiskNotificationFormVisible={(flag) => {
              setRiskNotificationFormVisible(flag);
            }}
            selectRowData={selectRowData}
          />
        )}
      </div>
    </div>
  );
};

export default InHospitalRegister;
