/**
 * 血糖记录
 *  */
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
} from 'antd';
import { history } from 'umi'
import { columns } from './data';
import moment from 'moment';
import {
  delVitalSignRecord,
  pageVitalSignRecord,
} from '@/services/nursingManagement'
import { dictDateSelect } from '@/services/basicSetting/dictionary'
import './index.less';
import { ULayout } from '@/utils/common'
const validateMessages = {
  required: '${label} 为必填项',
};

const RloodGlucoseRecord = (props) => {
  //列表数据
  const [dataSource, setDataSource] = useState([]);//数据
  //字典
  const [samplingStatusMap, setSamplingStatusMap] = useState([]);//血糖采样状态的字典
  //搜索的表单
  const [SForm] = Form.useForm();
  //初始化操作
  useEffect(() => {
    let param = { pageNum: 1, pageSize: 1000 }
    getBloodSugarInfo(param)
    //获取字典
    getDictDataSelect({ pageNum: 1, pageSize: 20, typeCode: "0006" })
  }, []);
  //获取血糖列表信息
  const getBloodSugarInfo = async (param) => {
    let res = await pageVitalSignRecord(param);
    if (res['code'] === 200) {
      setDataSource(res['data'])
    } else {
      setDataSource([])
    }
  }
  //刷新操作
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
  // 搜索表单
  const renderSearch = () => {
    return (
      <Form onFinish={() => { }} {...ULayout(8, 16, 'left', 'inline')} form={SForm}>
        <Form.Item label="姓名" name={'name'}>
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
            onClick={() => { handleJumpbatch("2", "add") }}
          >
            新增记录
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size={'small'}
            onClick={() => { SForm.resetFields() }}
          >
            清空
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //新增或者修改的时候到批量的页面
  const handleJumpbatch = (key, type, row) => {
    history.push({
      pathname: '/nursingManagement/nursingAddRecord/index',
      query: {
        selectKey: key,
        type: type,
        recordId: row?.id
      }
    });
  }
  //操作
  const editButton = (record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          size={'small'}
          type="link"
          onClick={() => { handleJumpbatch("2", "edit", record) }}
        >
          修改
        </Button>
        <Button
          size={'small'}
          type="link"
          onClick={async () => {
            let res = await delVitalSignRecord({ id: record['id'] })
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
    <div class="root">
      <div class="content">
        {renderSearch()}
        {renderForm()}
      </div>
    </div>
  );
};

export default RloodGlucoseRecord;
