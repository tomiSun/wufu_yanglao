import request from 'umi-request';
import { message, Modal } from 'antd';
import envConfig from '../../config/env';
// import { getConfig } from '@/api/index.js';

// request拦截器, 改变url 或 options.
request.interceptors.request.use(async (url, options) => {
  // if (!options.headers['Authorization']) {
  //   options.headers['Authorization'] = sessionStorage.getItem('Authorization');
  // }
  options.headers['Authorization'] =
    'AUTH_TOKEN:eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJUZXN0NCIsInVzZXJJZCI6IjM4OTUxMjE0NTAzMDYxMDk0NCIsIm5hbWUiOiLmi4nmi4kiLCJleHAiOjE2MjI1MzAwODF9.C20kygbSlsN57JOYkETgwKt6ybLxqKiwhDLi4pPFHFT3VQuRuOwRlauVPYz9-1hJ2QoO-XD0jiO8jKBwSK-TmSGOjFGZIEkR7vqHNIYjaNM1EIO7u439k4Oq25pRJJpioVFQxi-DbXJjH50N2AOfg3TdZryBk2RBToQIsqYravU';
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
    data.status == 1005 ||
    data.status === 10013 ||
    data.status === 10014 ||
    data.status === 10017 ||
    data.status === 11021
  ) {
    return data;
  } else if (data.status != 200) {
    message.error(data.message || data.Message);
    // Modal.confirm({
    //   title: '提示',
    //   icon: <ExclamationCircleOutlined />,
    //   content: data.message,
    //   okText: '确认',
    //   cancelText: '取消',
    //   centered:true,
    // })
    return Promise.reject(data.message);
  } else {
    return data;
  }
});

export default request;
