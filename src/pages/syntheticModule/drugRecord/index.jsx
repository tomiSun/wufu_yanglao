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
  Tabs,
  message,
  Pagination
} from 'antd';
import {
  medicineRecordInsert,
  medicineRecordQuery,
  medicationRecordUpdate,
  medicineRecordDel
} from '@/services/nursingManagement'
import { dictDateSelect } from '@/services/basicSetting/dictionary'
import { dataSource, columns } from './data';
import { ULayout } from '@/utils/common';
//登记接口
import {
  patientQuery,
  queryHospitalRegist,
} from '@/services/inHospitalRegister';
import moment from 'moment';
//导出
import { excelExport } from '@/utils/ExcelExport';
const DICT_LSIT = { "0019": [] }
const DICT_ARR = ["0019"]
//通用校验提醒
const validateMessages = {
  required: '${label} 为必填项',
};

const DrugRecord = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  //列表数据
  const [dataSource, setDataSource] = useState([{ 1: 1 }]);//数据
  //字典
  const [samplingStatusMap, setSamplingStatusMap] = useState([]);//血糖采样状态的字典
  //弹窗模式
  const [ftype, setFtype] = useState("add")
  //搜索的表单
  const [SForm] = Form.useForm();
  //录入表单的
  const [TForm] = Form.useForm();
  //选中的行
  const [selectData, setSelectData] = useState([])
  //新增选中的人
  const [addBasicInfo, setAddBasicInfo] = useState({})
  //人名数据
  const [nameSelectList, setNameSelectList] = useState([]);//复合搜索的人的集合
  //字典
  const [dictionaryMap, setDictionaryMap] = useState(DICT_LSIT)
  //列表选中
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1
  })
  //初始化操作
  useEffect(() => {
    getmedicineRecordQuery(pageInfo)
    //获取字典
    getDictDataSelect(DICT_ARR);//过敏史
  }, []);
  //刷新操作
  const refushList = (pageParam) => {
    let search = SForm.getFieldsValue();
    let pageInfoCopy = { ...pageInfo, ...pageParam }
    // let startTime = search?.['startTime'] && moment(search?.['startTime']).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    // let endTime = search?.['endTime'] && moment(search?.['endTime']).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    let param = { ...search, ...pageInfoCopy }
    getmedicineRecordQuery(param)

  }
  //获取字典
  const getDictDataSelect = async (dList) => {
    let resMap = {}
    for (const [idx, it] of dList.entries()) {
      let param = { pageNum: 1, pageSize: 20, typeCode: String(it) }
      const res = await dictDateSelect(param);
      let key = param['typeCode']
      resMap[key] = res['data']['list']
      if (idx == dList.length - 1) {
        setDictionaryMap(resMap)
      }
    }
  }
  //获取血糖列表信息
  const getmedicineRecordQuery = async (param) => {
    let res = await medicineRecordQuery(param)
    if (res['code'] === 200) {
      setDataSource(res['data']['list'].map(item => { return { ...item, key: item.id } }))
      setPageInfo({ pageNum: param['pageNum'], pageSize: param['pageSize'], total: res.data.total })
    } else {
      setDataSource([])
    }
  }

  //姓名搜索框
  const nameSelectChange = async (value) => {
    if (!value) {
      message.success("该人员已经退院")
      return
    }
    let res = await queryHospitalRegist({ businessNo: value, pageSize: 10, pageNum: 1, status: 0, statue: 0, });
    if (res?.data?.list[0]) {
      let data = res?.data?.list[0]
      setAddBasicInfo({ ...data, archiveId: data.id })
      TForm.setFieldsValue({ ...data, relationName: data.guardianName })
    }
  }
  //姓名搜索框
  const nameSelectBlur = async (e, data) => {
    let res = await patientQuery({ keyWords: e });
    if (!!res['data']) {
      let data = res['data'].map(item => {
        return { label: item['name'], value: item['businessNo'] }
      })
      setNameSelectList(data)
    } else {
      setNameSelectList([])
    }
  }
  // 搜索部分
  const renderSearch = () => {
    return (
      <Form {...ULayout(8, 16, 'left', 'inline')} form={SForm}>
        <Form.Item label="姓名" name={'name'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} allowClear />
        </Form.Item>
        <Form.Item label="住院号" name={'businessNo'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} />
        </Form.Item>
        {/* <Form.Item label="服药日期" name={'medicationDate'}>
          <DatePicker AUTOCOMPLETE="OFF" size={'small'} />
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" size={'small'}
            onClick={() => { refushList({ pageNum: 1 }) }}>
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            onClick={() => {
              setFtype("add")
              setModalVisible(true);
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
              excelExport({
                api: '/medicine/exportMedicationRecord', //导出接口路径
                ids: selectedRowKeys.join(","), //勾选的行id数组集合
                fileName: '服药管理记录', //导出文件名称
              });
            }}
          >
            导出
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //操作
  const editButton = (record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {
          <>
            <Button
              size={'small'}
              type="link"
              onClick={() => {
                setFtype("edit")
                setModalVisible(true);
                setSelectData(record);
                let data = { ...record, medicationDate: moment(record['medicationDate']) }
                TForm.setFieldsValue(data)
              }}
            >
              编辑
            </Button>
            <Button
              size={'small'}
              type="link"
              style={{ marginLeft: 10 }}
              onClick={async () => {
                let res = await medicineRecordDel({ id: record.id })
                message.success("删除成功")
                refushList({ pageNum: 1 })
              }}
            >
              删除
            </Button>
          </>
        }
      </div>
    );
  };
  //选中操作
  const onSelectChange = (selectedRowKeys, record) => {
    setSelectedRowKeys(selectedRowKeys)
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
            setPageInfo({ total: pageInfo.total, pageNum: page, pageSize })
            refushList({ total: pageInfo.total, pageNum: page, pageSize });
          }}
          style={{ position: "absolute", bottom: 35, right: 50 }} />
      </div>
    );
  };
  //弹窗
  const renderMoadl = () => {
    return (
      <Modal
        title="服药记录"
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
          <Form  {...ULayout(8, 16)} style={{ marginTop: 20 }} form={TForm}>
            <Form.Item label="姓名:" name={'name'}>
              <Select
                showSearch
                placeholder="姓名"
                onSearch={nameSelectBlur}
                style={{ width: 200 }}
                onChange={(value) => {
                  nameSelectChange(value)
                }}
                options={nameSelectList}
                filterOption={(inputValue, option) => {
                  return option.label.indexOf(inputValue) > -1
                }}
              >
              </Select>
            </Form.Item>
            <Form.Item label="用药时间" name={'medicationTime'}>
              <Select style={{ width: 200 }}>
                {dictionaryMap?.["0019"].map(item => {
                  return <Option value={item['dictCode']}>{item['dictName']}</Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item label="用药日期" name={'medicationDate'} initialValue={moment(new Date())}>
              <DatePicker style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="药品规格" name={'drugSpecification'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="剂量" name={'measure'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="频次" name={'frequency'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
          </Form>
          <Form.Item >
            <Button
              style={{ marginLeft: 200 }}
              type={"primary"}
              onClick={async () => {
                let param = TForm.getFieldsValue()
                if (ftype == "add") {
                  let params = { ...param, businessNo: addBasicInfo['businessNo'], bedCode: selectData['bedCode'] }
                  let res = await medicineRecordInsert(params);
                  message.success("添加成功")
                  setModalVisible(false);
                  refushList({ pageNum: 1 })
                }
                if (ftype == "edit") {
                  let params = { ...param, id: selectData.id, businessNo: selectData['businessNo'], bedCode: selectData['bedCode'] }
                  let res = await medicationRecordUpdate(params);
                  message.success("修改成功")
                  setModalVisible(false);
                  refushList({ pageNum: 1 })
                }
              }}>{ftype == "add" ? "保存" : "修改"}</Button>
          </Form.Item>
        </div>
      </Modal >
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

export default DrugRecord;
