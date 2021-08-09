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
} from 'antd';

export default () => {
  return (
    <div className="home">
      <Row gutter={16}>
        <Col span={8}>
          <Card className={styles.room} title="room001">
            Card content
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title">Card content</Card>
        </Col>
        <Col span={8}>
          <Card title="Card title">Card content</Card>
        </Col>
      </Row>
    </div>
  );
};
