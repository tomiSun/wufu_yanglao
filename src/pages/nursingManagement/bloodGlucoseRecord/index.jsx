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
  message,
} from 'antd';
import { history } from 'umi'
import { columns } from './data';
import moment from 'moment';
import {
  bloodSugarDel,
  bloodSugarQuery,
  bloodSugarUpdate,
  bloodSugarInsert
} from '@/services/nursingManagement'
import { dictDateSelect } from '@/services/basicSetting/dictionary'
import './index.less';
const { TabPane } = Tabs;
const layout = (x, y, labelAlign, layout) => {
  return {
    labelCol: { span: x },
    wrapperCol: { span: y },
    labelAlign,
    layout,
  };
};
const layout2 = {
  labelCol: { span: 11 },
  wrapperCol: { span: 13 },
};
const validateMessages = {
  required: '${label} 为必填项',
};

const RloodGlucoseRecord = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  const [dataSource, setDataSource] = useState([]);//数据
  const [samplingStatusMap, setSamplingStatusMap] = useState([]);//血糖采样状态的字典
  const [SForm] = Form.useForm();
  useEffect(() => {
    //初始化列表
    let param = { pageNum: 1, pageSize: 1000 }
    getBloodSugarInfo(param)
    //获取字典
    getDictDataSelect({ pageNum: 1, pageSize: 20, typeCode: "0006" })
  }, []);

  //获取血糖列表信息
  const getBloodSugarInfo = async (param) => {
    let res = await bloodSugarQuery(param);
    if (res['code'] === 200) {
      setDataSource(res['data']['list'])
    } else {
      setDataSource([])
    }
  }
  const refushList = () => {
    let search = SForm.getFieldsValue();
    let startTime = search?.['startTime'] && moment(search?.['startTime']).startOf('day').format('YYYY-MM-DD HH:mm:ss');
    let endTime = search?.['endTime'] && moment(search?.['endTime']).endOf('day').format('YYYY-MM-DD HH:mm:ss');
    let param = { ...SForm.getFieldsValue(), pageNum: 1, pageSize: 1000, startTime, endTime }
    getBloodSugarInfo(param)
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
      <Form onFinish={() => { }} {...layout(8, 16, 'left', 'inline')} form={SForm}>
        <Form.Item label="姓名" name={'patientName'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item label="住院号" name={'businessNo'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item label="开始日期" name={'startTime'}>
          <DatePicker size={'small'} />
        </Form.Item>
        <Form.Item label="结束日期" name={'endTime'}>
          <DatePicker size={'small'} />
        </Form.Item>
        <Form.Item label="采样状态" name={'samplingStatus'}  {...layout(12, 16)}>
          <Select defaultValue="0001" size={'small'}>
            {samplingStatusMap.map(item => {
              return <Option value={item['dictCode']}>{item['dictName']}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item style={{ marginLeft: 20 }}>
          <Button
            type="primary"
            size={'small'}
            style={{ marginTop: 4 }}
            onClick={() => {
              refushList()
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
              history.push({
                pathname: '/nursingManagement/nursingAddRecord/index',
                query: {
                  selectKey: "3",
                  type: "add"
                }
              });
            }}
          >
            新增记录
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //操作
  const editButton = (record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          size={'small'}
          type="link"
          onClick={() => {
            setModalVisible(true);
          }}
        >
          修改
        </Button>
        <Button
          size={'small'}
          type="link"
          onClick={async () => {
            let res = await bloodSugarDel({ id: record['id'] })
            message.success("成功")
            refushList()
          }}
        >
          删除
        </Button>
      </div>
    );
  };
  //表单
  const renderForm = () => {
    return (
      <div>
        <Table columns={columns(editButton, samplingStatusMap)} dataSource={dataSource} />
      </div>
    );
  };
  return (
    <div class="archives">
      <div class="content">
        {renderSearch()}
        {renderForm()}
      </div>
    </div>
  );
};

export default RloodGlucoseRecord;
