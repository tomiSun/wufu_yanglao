import './index.less';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Table,
  Input,
  DatePicker,
  Modal,
  Pagination
} from 'antd';
import { columns } from './data';
import { ULayout } from '@/utils/common'
import {
  riskNotificationQueryList
} from '@/services/inHospitalRegister'
const RiskNotification = (props) => {
  const [modalVisible, setModalVisible] = useState(false); //基本信息
  const [dataSource, setDataSource] = useState([]);//数据
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1
  })
  const [SForm] = Form.useForm();
  useEffect(() => {
    let param = pageInfo
    getList(param);
  }, [])
  //获取数据
  const getList = async (param) => {
    let res = await riskNotificationQueryList(param);
    setDataSource(res['data']['list'])
    setPageInfo({
      pageSize: param.pageSize,
      pageNum: param.pageNum,
      total: res.data.total
    })
  }
  //刷新
  const refushList = async (pageParam) => {
    let search = SForm.getFieldsValue();
    let pageInfoCopy = { ...pageInfo, ...pageParam }
    let param = {
      ...search,
      pageSize: pageInfoCopy.pageSize,
      pageNum: pageInfoCopy.pageNum,
      status: 0
    }
    getList(param)
  }
  // 搜索部分
  const renderSearch = () => {
    return (
      <Form {...ULayout(8, 16, "left", "inline")} >
        <Form.Item label="姓名" name={'name'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item label="档案ID" name={'businessNo'}>
          <Input size={'small'} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" size={'small'}
            style={{ marginLeft: 20 }}
            onClick={() => {
              refushList({ pageNum: 1 })
            }}
          >
            查询
          </Button>
        </Form.Item>
      </Form>
    );
  };
  //操作
  const editButton = (record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {record.status == '0' && (
          <Button
            size={'small'}
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            签订
          </Button>
        )}
      </div>
    );
  };
  //表单
  const renderForm = () => {
    return (
      <div>
        <Table
          columns={columns(editButton)}
          dataSource={dataSource}
          scroll={{ x: 1300 }}
          pagination={false}
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
      </div >

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

export default RiskNotification;
