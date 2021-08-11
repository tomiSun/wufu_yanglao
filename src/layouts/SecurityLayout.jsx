import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect } from 'umi';
import { stringify } from 'querystring';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
    routes: ['/syntheticModule/satisficing'],
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
  }

  render() {
    const { isReady } = this.state;
    const { children } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    let isLogin = !!sessionStorage.getItem('Authorization');
    if (this.state.routes.includes(window.location.pathname)) {
      isLogin = true;
    }
    const queryString = stringify({
      redirect: window.location.href,
    });

    // if (!isLogin && window.location.pathname !== '/user/login') {
    //   return <Redirect to={`/user/login?${queryString}${window.location.pathname}`} />;
    // }

    // if (!isLogin || !isReady) {
    //   return <PageLoading />;
    // }

    return children;
  }
}

export default SecurityLayout;
