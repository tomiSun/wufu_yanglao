import React, { useState, useEffect, useRef } from 'react';
import styles from './index.less';
import { SearchForm, YTable, Seltopt } from 'yunyi-component';
import {
  Form,
  Modal,
  Input,
  Row,
  Col,
  Radio,
  InputNumber,
  message,
  Button,
  Divider,
  DatePicker,
  Checkbox,
  Rate,
  Card,
  Skeleton,
  Collapse,
  Popover,
  List,
  Select,
  Tag,
  Anchor,
  Switch,
  Spin,
} from 'antd';
import { dictTypeSelectPullDown } from '@/services/basicSetting/dictionary';
import { bedBuildList } from '@/services/basicSetting/bedInfo';
import { queryPage, queryPageBed } from '@/services/home/index';
import { findValByKey, getDefaultOption } from '@/utils/common';
const { Panel } = Collapse;

export default () => {
  const color = {
    empty: '#fdfbdb',
    checkIn: '#f9e3e3',
  };
  // 基础字典数据
  const [basic, setBasic] = useState({});
  const [buildingOpt, setBuildingOpt] = useState([]);
  const [buildingCode, setBuildingCode] = useState('');
  const [list, setList] = useState({});
  const [count, setCount] = useState({});

  // 获取楼宇下拉框数据
  const getBedBuildList = () => {
    bedBuildList().then((res) => {
      const opt =
        res?.data?.map((it) => {
          return { value: it.buildingCode, label: it.name };
        }) || [];
      setBuildingOpt(opt);
      if (opt?.length) {
        setBuildingCode(opt[0].value);
      }
    });
  };
  // 修改收费状态
  const changeFeesDueStatue = () => {};
  // 获取过敏史
  const getAllergyNames = (codes) => {
    if (!codes) {
      return '';
    }
    const codeList = codes.split(',');
    const res = codeList.map((it) => {
      return findValByKey(basic['0008'], 'value', it, 'label');
    });
    return res.join(',');
  };
  const bedDom = (bedList) => {
    return bedList?.map((bed) => {
      return (
        <>
          <Col style={{ flex: 1 }}>
            <Popover
              autoAdjustOverflow={true}
              arrowPointAtCenter={true}
              content={
                <List
                  size="small"
                  // header={<div style={{ paddingLeft: '15px' }}>操作</div>}
                  dataSource={[
                    '三测单',
                    '护理记录',
                    '特级护理记录',
                    '血糖记录',
                    '药品管理',
                    '服药记录',
                    '请假',
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Button type="link">{item}</Button>
                    </List.Item>
                  )}
                />
              }
              placement={'right'}
              title={<div style={{ paddingLeft: '2px 10px' }}>操作</div>}
              trigger="contextMenu"
            >
              <Card
                bordered={false}
                className={styles.bed}
                title={bed?.bedName}
                style={{ background: bed?.status === '1' ? color.checkIn : color.empty }}
              >
                <Collapse defaultActiveKey={[]} ghost expandIconPosition="right">
                  {bed?.status === '1' ? (
                    <Panel
                      header={
                        <div className={styles.rowHeader}>
                          {/* <img
                      className={styles.avatar}
                      src="https://via.placeholder.com/300.png/09f/fff"
                    /> */}
                          <div className={styles.name}>{bed?.name}</div>
                          <div className={styles.sex}>{bed?.sex}</div>
                          <div className={styles.age}>{bed?.age}岁</div>
                          <div className={styles.age}>{bed?.nursingLevelName}</div>
                        </div>
                      }
                      key={bed?.bedCode}
                    >
                      <div className={styles.row}>
                        <div className={styles.item}>
                          病区：{bed?.buildingName}
                          {bed?.floorName}
                        </div>
                      </div>
                      {/* <div className={styles.row}>
                  <div className={styles.item}>级别护理：特级护理</div>
                </div> */}
                      <div className={styles.row}>
                        <div className={styles.item}>联系电话：{bed?.contactNumber}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.item}>入院时间：{bed?.admissionTime}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.item}>费用到期：{bed?.feesDueDate}</div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.item}>
                          费用到期：{bed?.feesDueStatue ? '到期' : '未到期'}
                          {/* <span>
                            <Switch
                              value={!!bed?.feesDueStatue}
                              onChange={() => {
                                changeFeesDueStatue();
                              }}
                            />
                          </span> */}
                        </div>
                      </div>
                      <div className={styles.row}>
                        <div className={styles.item}>入院诊断：{bed?.hospitalDiagnosis}</div>
                      </div>
                      <div className={styles.row}>
                        {/* TODO */}
                        <div className={styles.itemTwo}>
                          过敏史：{getAllergyNames(bed?.allergy)}
                        </div>
                      </div>
                    </Panel>
                  ) : (
                    <div style={{ height: '100%', minHeight: '33px' }}></div>
                  )}
                </Collapse>
              </Card>
            </Popover>
          </Col>
        </>
      );
    });
  };
  const roomDom = (roomList) => {
    return (
      <Row gutter={5} justify="start">
        {roomList?.map((room) => {
          return (
            <>
              <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                <Card
                  bordered={false}
                  className={styles.room}
                  title={`${room.roomName}(${room.roomTypeName})`}
                >
                  <Row gutter={5} style={{ height: '100%' }}>
                    {bedDom(room?.pageDetailQueryVOS || [])}
                  </Row>
                </Card>
              </Col>
            </>
          );
        })}
      </Row>
    );
  };

  // 获取字典数据
  const getDictionaryData = () => {
    dictTypeSelectPullDown(['0008']).then((response) => {
      setBasic(response.data);
    });
  };
  // 获取展示数据
  const queryPageService = (params) => {
    queryPage(params)
      .then((res) => {
        const keys =
          res?.data?.map((floor) => {
            return floor.floorCode;
          }) || [];
        setList({ data: res?.data || [], keys });
      })
      .catch((err) => {
        console.log('err-queryPage: ', err);
      });
  };
  // 获取床位统计
  const queryPageBedService = (params) => {
    queryPageBed(params)
      .then((res) => {
        setCount(res?.data || {});
      })
      .catch((err) => {
        console.log('err-queryPageBed: ', err);
      });
  };

  useEffect(() => {
    if (buildingCode) {
      queryPageService({ buildingCode });
      queryPageBedService();
    }
  }, [buildingCode]);
  useEffect(() => {
    getDictionaryData();
    getBedBuildList();
  }, []);
  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Select
            placeholder="请选择楼宇"
            options={buildingOpt}
            style={{ width: '200px' }}
            value={buildingCode}
            onChange={(e) => {
              setBuildingCode(e);
            }}
          ></Select>
          <Button
            type="primary"
            className={styles.search}
            onClick={() => {
              queryPageService({ buildingCode });
              queryPageBedService();
            }}
          >
            查询
          </Button>
        </div>

        <div className={styles.right}>
          <div className={styles.bedInfo}>
            <Tag color="#fff" style={{ color: '#000' }}>
              总房间：{count?.roomNum || '-'}
            </Tag>
            <Tag color="#fff" style={{ color: '#000' }}>
              总床位：{count?.bedNum || '-'}
            </Tag>
            <Tag color={color.empty} style={{ color: '#000' }}>
              空闲床位：{count?.freeBedNum || '-'}
            </Tag>
            <Tag color={color.checkIn} style={{ color: '#000' }}>
              入住床位：{count?.checkInBedNum || '-'}
            </Tag>
          </div>
        </div>
      </div>
      {list?.data?.length ? (
        <Collapse defaultActiveKey={list?.keys || []}>
          {list?.data?.map((floor) => {
            return (
              <Panel header={floor?.floorName} key={floor?.floorCode}>
                {roomDom(floor?.pageRoomQueryVOList || [])}
              </Panel>
            );
          })}
        </Collapse>
      ) : (
        <div className={styles.spinContainer}>
          <Spin />
        </div>
      )}
    </div>
  );
};
