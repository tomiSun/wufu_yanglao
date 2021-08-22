import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Modal, Form, Input } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { loginout, updatePassword } from '@/services/User/login';
const AvatarDropdown = (props) => {
  const { menu } = props;
  // modal配置项
  const [modalForm] = Form.useForm();
  const onFinish = async () => {
    const formVals = await modalForm.validateFields();
    console.log('formVals: ', formVals);
    updatePassword(formVals)
      .then((res) => {
        sessionStorage.setItem('Authorization', '');
        sessionStorage.setItem('employeeCode', '');
        sessionStorage.setItem('name', '');
        sessionStorage.setItem('userId', '');
        history.push('/user/login');
      })
      .catch((err) => {
        console.log('err-updatePassword: ', err);
      });
  };
  const onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      loginout()
        .then((res) => {
          sessionStorage.setItem('Authorization', '');
          sessionStorage.setItem('employeeCode', '');
          sessionStorage.setItem('name', '');
          sessionStorage.setItem('userId', '');
          history.push('/user/login');
        })
        .catch((err) => {
          console.log('err-logining: ', err);
        });
    }
    if (key === 'center') {
      Modal.confirm({
        title: '修改密码',
        centered: true,
        onOk: onFinish,
        content: (
          <Form
            name="basic"
            labelCol={{ flex: '60px' }}
            form={modalForm}
            initialValues={{ employeeCode: sessionStorage.getItem('employeeCode'), password: '' }}
          >
            <Form.Item
              label="用户名"
              name="employeeCode"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入新密码!' }]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        ),
      });
    }
  };
  const currentUser = {
    avatar: '',
    name: sessionStorage.getItem('name'),
  };
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          修改密码
        </Menu.Item>
      )}
      {/* {menu && (
      <Menu.Item key="settings">
        <SettingOutlined />
        个人设置
      </Menu.Item>
    )} */}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return currentUser && currentUser.name ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
};
export default AvatarDropdown;
