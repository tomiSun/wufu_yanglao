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
} from 'antd';
const { Panel } = Collapse;

export default () => {
  const roomDom = () => {
    return (
      <Row gutter={15} justify="start">
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Card className={styles.room} title="001房（双人房）">
            <Row gutter={15}>
              <Col style={{ flex: 1 }}>
                <Card className={styles.bed} title="001床">
                  <div className={styles.rowHeader}>
                    <img
                      className={styles.avatar}
                      src="https://via.placeholder.com/300.png/09f/fff"
                    />
                    <div>张三</div>
                    <div>男</div>
                    <div>60岁</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>病区：第一病区</div>
                    <div className={styles.item}>级别护理：特级护理</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>入院时间：2021-8-11</div>
                    <div className={styles.item}>费用到期：2022-9-20</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>入院诊断：老年痴呆</div>
                    <div className={styles.item}>联系电话：131097890987</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.itemTwo}>过敏史：过敏</div>
                  </div>
                </Card>
              </Col>
              {/* <Col style={{ flex: 1 }}>
                <Card className={styles.bed} title="002床">
                  <div className={styles.rowHeader}>
                    <img
                      className={styles.avatar}
                      src="https://via.placeholder.com/300.png/09f/fff"
                    />
                    <div>张三</div>
                    <div>男</div>
                    <div>60岁</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>病区：第一病区</div>
                    <div className={styles.item}>级别护理：特级护理</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>入院时间：2021-8-11</div>
                    <div className={styles.item}>费用到期：2022-9-20</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.item}>入院诊断：老年痴呆</div>
                    <div className={styles.item}>联系电话：131097890987</div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.itemTwo}>过敏史：过敏</div>
                  </div>
                </Card>
              </Col> */}
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Card className={styles.room} title="001房（双人房）">
            <Row>
              <Col style={{ flex: 1 }}>0001床</Col>
              <Col style={{ flex: 1 }}>0002床</Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Card className={styles.room} title="001房（双人房）">
            <Row>
              <Col style={{ flex: 1 }}>0001床</Col>
              <Col style={{ flex: 1 }}>0002床</Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };
  return (
    <div className={styles.home}>
      <Collapse>
        <Panel header="1楼" key="1">
          {roomDom()}
        </Panel>
        <Panel header="1楼" key="1">
          {roomDom()}
        </Panel>
      </Collapse>
    </div>
  );
};
