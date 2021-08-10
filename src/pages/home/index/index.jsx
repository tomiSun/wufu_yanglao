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
