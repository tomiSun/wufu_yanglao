import './index.less';
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
  Pagination,
} from 'antd';
import { columns } from './data';
//登记接口
import { queryHospitalRegist } from '@/services/inHospitalRegister';

import { dictDateSelect } from '@/services/basicSetting/dictionary';
import moment from 'moment';
import { ULayout } from '@/utils/common';
const DICT_LSIT = { '0008': [], '0009': [], '0010': [], '0011': [], '0015': [] };
const DICT_ARR = ['0008', '0009', '0010', '0011', '0015'];

const InHospitalRegister = (props) => {
  const [SForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [dictionaryMap, setDictionaryMap] = useState(DICT_LSIT);
  const [pageInfo, setPageInfo] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
  });
  useEffect(() => {
    //获取字典
    getDictDataSelect(DICT_ARR); //过敏史
  }, []);

  useEffect(() => {
    let param = { ...pageInfo, status: 1 };
    getHospitalRegistList(param);
  }, []);

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

  const refushList = (pageParam = {}) => {
    let data = SForm.getFieldsValue();
    let pageInfoCopy = { ...pageInfo, ...pageParam };
    let param = {
      ...data,
      pageSize: pageInfoCopy.pageSize,
      pageNum: pageInfoCopy.pageNum,
      status: 1,
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
        <Form onFinish={() => {}} {...ULayout(8, 16, 'left', 'inline')} form={SForm}>
          <Form.Item label="姓名" name={'name'}>
            <Input size={'small'} allowClear />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size={'small'}
              onClick={() => {
                refushList();
              }}
            >
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  //表格
  const renderForm = () => {
    return (
      <>
        <Table
          columns={columns(dictionaryMap)}
          dataSource={dataSource}
          scroll={{ x: 1900 }}
          pagination={false}
        />
        <Pagination
          defaultCurrent={1}
          showSizeChanger
          pageSizeOptions={[10, 20, 50, 100, 200]}
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
  return (
    <div class="archives">
      <div class="content">
        {renderSearch()}
        {renderForm()}
      </div>
    </div>
  );
};

export default InHospitalRegister;
