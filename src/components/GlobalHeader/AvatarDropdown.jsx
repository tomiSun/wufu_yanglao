import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import {
  loginout,
} from '@/services/User/login';
class AvatarDropdown extends React.Component {
  
  onMenuClick = (event) => {
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
  };

  render() {
    const {
      // currentUser = {
      //   avatar: '',
      //   name: sessionStorage.getItem('name'),
      // },
      menu,
    } = this.props;
    const currentUser = {
      avatar: '',
      name: sessionStorage.getItem('name'),
    }
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
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
  }
}

export default AvatarDropdown;
// export default connect(({ user }) => ({
//   currentUser: user.currentUser,
// }))(AvatarDropdown);
