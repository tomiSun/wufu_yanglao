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
} from 'antd';
import {
  takeMedicineInsert,
  takeMedicineQuery,
  takeMedicineUpdate,
  takeMedicineDel
} from '@/services/nursingManagement'
import { dictDateSelect } from '@/services/basicSetting/dictionary'
import { dataSource, columns } from './data';
import { ULayout } from '@/utils/common';
//通用校验提醒
const validateMessages = {
  required: '${label} 为必填项',
};

const DrugManage = (props) => {
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
  const [Tform] = Form.useForm();
  //选中的行
  const [selectData, setSelectData] = useState([])
  //初始化操作
  useEffect(() => {
    let param = { pageNum: 1, pageSize: 1000 }
    getmedicineRecordQuery(param)
    //获取字典
    getDictDataSelect({ pageNum: 1, pageSize: 20, typeCode: "0006" })
  }, []);
  //刷新操作
  const refushList = () => {
    let search = SForm.getFieldsValue();
    let startTime = search?.['startTime'] && moment(search?.['startTime']).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    let endTime = search?.['endTime'] && moment(search?.['endTime']).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    let param = { ...SForm.getFieldsValue(), pageNum: 1, pageSize: 1000, startTime, endTime }
    getmedicineRecordQuery(param)
  }
  //获取血糖列表信息
  const getmedicineRecordQuery = async (param) => {
    let res = await takeMedicineQuery(param)
    if (res['code'] === 200) {
      setDataSource(res['data']['list'])
    } else {
      setDataSource([])
    }
  }
  //获取字典
  const getDictDataSelect = async (param) => {
    let res = await dictDateSelect(param);
    setSamplingStatusMap(res['data']['list'])
    SForm.setFieldsValue({ samplingStatus: "0001" })
  }
  // 搜索部分
  const renderSearch = () => {
    return (
      <Form {...ULayout(8, 16, 'left', 'inline')}>
        <Form.Item label="姓名" name={'name'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} />
        </Form.Item>
        <Form.Item label="住院编号" name={'businessNo'}>
          <Input AUTOCOMPLETE="OFF" size={'small'} />
        </Form.Item>
        <Form.Item label="服药日期" name={'medicationDate'}>
          <DatePicker AUTOCOMPLETE="OFF" size={'small'} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" size={'small'}
            onClick={() => { refushList() }}>
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
      </Form>
    );
  };
  //查询

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
                setFtype("add")
                setModalVisible(true);
                setSelectData(record)
              }}
            >
              编辑
            </Button>
            <Button
              size={'small'}
              type="link"
              style={{ marginLeft: 10 }}
              onClick={async () => {
                let res = await takeMedicineDel({ ids: record.id })
                refushList()
              }}
            >
              删除
            </Button>
          </>
        }
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
        title="血糖检测"
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
          <Form  {...ULayout(8, 16)} style={{ marginTop: 20 }} form={Tform}>
            <Form.Item label="姓名:" name={'name'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="诊断:" name={'hospitalDiagnosis'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="带药日期" name={'takeMedicineDate'}>
              <DatePicker style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="药品名称" name={'drugName'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="用法" name={'usage'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="用量" name={'dosage'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="带药量" name={'measure'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="自带药" name={'bloodGlucose'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="验收人" name={'accepterSign'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="过期时间" name={'expiryDate'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item label="备注" name={'remark'}>
              <Input size="small" style={{ width: 200 }} />
            </Form.Item>

          </Form>
          <Form.Item >
            <Button
              style={{ marginLeft: 200 }}
              type={"primary"}
              onClick={async () => {
                let param = Tform.getFieldsValue()
                if (ftype == "add") {
                  let res = await takeMedicineInsert(param);
                  message.success("添加成功")
                  setModalVisible(false);
                  refushList()
                }
                if (ftype == "edit") {
                  let res = await takeMedicineUpdate({ ...param, id: selectData.id });
                  message.success("修改成功")
                  setModalVisible(false);
                  refushList()
                }
              }}>{ftype == "add" ? "保存" : "修改"}</Button>
          </Form.Item>
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

export default DrugManage;
