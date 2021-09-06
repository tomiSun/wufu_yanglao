import request from 'umi-request';
import { message, Modal } from 'antd';
import envConfig from '../../config/env';
// import { getConfig } from '@/api/index.js';
import { history } from 'umi';
// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  if (!options.headers['Authorization']) {
    options.headers['Authorization'] = sessionStorage.getItem('Authorization');
  }
  !!options.data &&
    Object.keys(options.data).map((item) => {
      typeof options.data[item] == 'string' && (options.data[item] = options.data[item].trim());
      if (options.data[item] == undefined || options.data[item] == null) {
        delete options.data[item];
      }
    });
  !!options.params &&
    Object.keys(options.params).map((item) => {
      typeof options.params[item] == 'string' &&
        (options.params[item] = options.params[item].trim());
      if (options.params[item] == undefined || options.params[item] == null) {
        delete options.params[item];
      }
    });
  if (options.method === 'get') {
    url = url.replace(/undefined|null/g, '');
  }
  if (envConfig[process.env.API_ENV]) {
    url = envConfig[process.env.API_ENV].BASE_API + url;
  } else {
    url = '/api' + url;
  }
  return { url, options };
});

// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  const data = response.clone().json() ? await response.clone().json() : await response.clone();
  // 账户密码登陆 10013-10014-10017
  // 钉钉 11021
  if (
    data.code == 1005 ||
    data.code === 10013 ||
    data.code === 10014 ||
    data.code === 10017 ||
    data.code === 11021
  ) {
    return data;
  } else if (data.code != 200) {
    message.error(data.msg);
    // Modal.confirm({
    //   title: '提示',
    //   icon: <ExclamationCircleOutlined />,
    //   content: data.message,
    //   okText: '确认',
    //   cancelText: '取消',
    //   centered:true,
    // })
    if (data.code == '2002') {
      sessionStorage.setItem('Authorization', '');
      sessionStorage.setItem('employeeCode', '');
      sessionStorage.setItem('name', '');
      sessionStorage.setItem('userId', '');
      history.push('/user/login');
    }
    return Promise.reject(data.message);
  } else {
    return data;
  }
});

export default request;
