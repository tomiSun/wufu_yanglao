import {
  Alert,
  Modal,
  Avatar,
  Row,
  Col,
  Upload,
  Button,
  message,
  Progress,
  Select,
  Form,
  Input,
  Image,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { ReloadOutlined, ExclamationCircleOutlined, SmileOutlined } from '@ant-design/icons';
import LoginForm from './components/Login';
import styles from './style.less';
import {
  logining,
  verificationCodeLogin,
  loginCheck,
  userChangePassword,
  forgetPassword,
  tokenVerify,
  checkRole,
  getQrCodeInfo,
  getScanStatus,
} from '@/services/User/login';

import { get } from 'lodash';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;
const { Option } = Select;
const { confirm } = Modal;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState('account');
  const [update, setUpdate] = useState(false);

  const [changePassModal, setChangePassModal] = useState(false); // 弹窗 - 修改密码
  const [changePassModalForm] = Form.useForm(); // 表单 - 修改密码

  const [forgetPassModal, setForgetPassModal] = useState(false); // 弹窗 - 忘记密码
  const [forgetPassModalForm] = Form.useForm(); // 表单 - 修改密码

  const [dingTime, setDingTime] = useState({
    load: null,
    num: 0,
  }); // dingding定时器
  const [dingCode, setDingCode] = useState({}); // dingding二维码
  const [dingLoad, setDingLoad] = useState(true); // dingding二维码失效刷新

  const [roleList, setRoleList] = useState([]); // 设置角色列表设置角色列表
  const [roleModal, setRoleModal] = useState(false); //角色modal
  // 证书
  const [authKey, setAuthKey] = useState({
    key: null,
  });
  let percent = 0;
  const [percentNum, setPercentNum] = useState();

  // 初始化环境98/101
  const [pathSci, setPathSci] = useState('98');
  let pathSciList = [
    { val: '50', name: '开发网' },
    { val: '48', name: '测试网' },
    { val: '98', name: '医保网' },
    { val: '101', name: '卫生网' },
  ];

  // 点击登录函数
  const handleSubmit = async (values) => {
    logining(values)
      .then((res) => {
        sessionStorage.setItem('Authorization', get(res, 'data.token', ''));
        sessionStorage.setItem('employeeCode', get(res, 'data.employeeCode', ''));
        sessionStorage.setItem('name', get(res, 'data.name', ''));
        sessionStorage.setItem('userId', get(res, 'data.userId', ''));
        history.push('/basicSetting/dictionary');
      })
      .catch((err) => {
        console.log('err-logining: ', err);
      });
    // if (type === 'account') {
    //   logining(values)
    //     .then(async (res) => {
    //       sessionStorage.setItem('Authorization', get(res, 'data.token', ''));
    //       sessionStorage.setItem('realName', get(res, 'data.realName', ''));
    //       sessionStorage.setItem('userId', get(res, 'data.userId', ''));
    //       sessionStorage.setItem('orgAddress', get(res, 'data.orgAddress', ''));
    //       sessionStorage.setItem('orgId', get(res, 'data.orgId', ''));
    //       sessionStorage.setItem('orgUserId', get(res, 'data.orgUserId', ''));
    //       sessionStorage.setItem('orgName', get(res, 'data.orgName', ''));
    //       sessionStorage.setItem('areaCode', get(res, 'data.areaCode', ''));
    //       sessionStorage.setItem('jobNumber', get(res, 'data.jobNumber', ''));
    //       sessionStorage.setItem('contactsPhone', get(res, 'data.contactsPhone', ''));
    //       sessionStorage.setItem('phone', get(res, 'data.phone', ''));
    //       sessionStorage.setItem('idCard', get(res, 'data.idCard', ''));
    //       sessionStorage.setItem('userName', get(res, 'data.userName', ''));

    //       changePassModalForm.setFieldsValue({
    //         userId: res.data?.userId,
    //         phone: res.data?.phone,
    //       });
    //       forgetPassModalForm.setFieldsValue({
    //         userId: res.data?.userId,
    //         // phone: res.data?.phone,
    //       });
    //       // 清除sqlite审核人
    //       clearAudit();
    //       await loginCheckServies(values, res);
    //     })
    //     .catch((err) => {
    //       console.log('err---logining', err);
    //     });
    // }
    // if (type === 'phone') {
    //   verificationCodeLogin(values)
    //     .then(async (res) => {
    //       sessionStorage.setItem('Authorization', get(res, 'data.token', ''));
    //       sessionStorage.setItem('realName', get(res, 'data.realName', ''));
    //       sessionStorage.setItem('userId', get(res, 'data.userId', ''));
    //       sessionStorage.setItem('orgAddress', get(res, 'data.orgAddress', ''));
    //       sessionStorage.setItem('orgId', get(res, 'data.orgId', ''));
    //       sessionStorage.setItem('orgUserId', get(res, 'data.orgUserId', ''));
    //       sessionStorage.setItem('orgName', get(res, 'data.orgName', ''));
    //       sessionStorage.setItem('areaCode', get(res, 'data.areaCode', ''));
    //       sessionStorage.setItem('jobNumber', get(res, 'data.jobNumber', ''));
    //       sessionStorage.setItem('contactsPhone', get(res, 'data.contactsPhone', ''));
    //       sessionStorage.setItem('phone', get(res, 'data.phone', ''));
    //       sessionStorage.setItem('idCard', get(res, 'data.idCard', ''));
    //       sessionStorage.setItem('userName', get(res, 'data.userName', ''));
    //       // 清除sqlite审核人
    //       clearAudit();
    //       tokenVerifyServies(res);
    //     })
    //     .catch((err) => {
    //       console.log('err---verificationCodeLogin', err);
    //     });
    // }
  };

  // 切换tabs
  useEffect(() => {
    if (type === 'dingding' && authKey.key) {
      getQrCodeInfoServies();
    } else {
      setDingLoad(false);
      clearTimeout(dingTime.load);
      setDingTime({
        load: null,
        num: 0,
      });
    }
  }, [type]);

  // 弹窗 - 修改密码 - 提交
  useEffect(() => {
    !changePassModal && changePassModalForm.resetFields();
  }, [changePassModal]);
  const changePassModalFormFinish = () => {
    console.log('changePassModalForm.getFieldsValue()===', changePassModalForm.getFieldsValue());
    let query = changePassModalForm.getFieldsValue();
    userChangePassword(query)
      .then((res) => {
        message.success(res.message);
        setChangePassModal(false);
      })
      .catch((err) => {
        console.log('err---userChangePassword', err);
      });
  };

  // 弹窗 - 忘记密码 - 提交
  useEffect(() => {
    !forgetPassModal && forgetPassModalForm.resetFields();
  }, [forgetPassModal]);
  const forgetPassModalFormFinish = () => {
    console.log('changePassModalForm.getFieldsValue()===', changePassModalForm.getFieldsValue());
    let query = forgetPassModalForm.getFieldsValue();
    forgetPassword(query)
      .then((res) => {
        message.success(res.message);
        setForgetPassModal(false);
      })
      .catch((err) => {
        console.log('err---forgetPassword', err);
      });
  };

  // 获取钉钉二维码
  const getQrCodeInfoServies = async () => {
    setDingLoad(true);
    clearTimeout(dingTime.load);
    setDingTime({
      load: null,
      num: 0,
    });
    let query = {
      resource: 'medicare', // cloud、his专用
    };
    await getQrCodeInfo(query)
      .then((res) => {
        setDingLoad(true);
        dingCode.uuid = res.data?.uuid;
        setDingCode(res.data);

        getScanStatusServies();
      })
      .catch((err) => {
        setDingLoad(false);
        console.log('err---getQrCodeInfo', err);
      });
  };
  // 检查钉钉授权状态
  const getScanStatusServies = async () => {
    let query = {
      secretKey: authKey.key, // 传入证书
      uuid: dingCode?.uuid,
    };
    try {
      let res = await getScanStatus(query);
      if (res.status === 11021) {
        dingTime.load = setTimeout(() => {
          getScanStatusServies();
          dingTime.num++;
        }, 2000);
        setDingTime({ ...dingTime });
      } else {
        // 登陆成功
        setDingLoad(false);
        clearTimeout(dingTime.load);
        setDingTime({
          load: null,
          num: 0,
        });

        sessionStorage.setItem('Authorization', get(res, 'data.token', ''));
        sessionStorage.setItem('realName', get(res, 'data.realName', ''));
        sessionStorage.setItem('userId', get(res, 'data.userId', ''));
        sessionStorage.setItem('orgAddress', get(res, 'data.orgAddress', ''));
        sessionStorage.setItem('orgId', get(res, 'data.orgId', ''));
        sessionStorage.setItem('orgUserId', get(res, 'data.orgUserId', ''));
        sessionStorage.setItem('orgName', get(res, 'data.orgName', ''));
        sessionStorage.setItem('areaCode', get(res, 'data.areaCode', ''));
        sessionStorage.setItem('jobNumber', get(res, 'data.jobNumber', ''));
        sessionStorage.setItem('contactsPhone', get(res, 'data.contactsPhone', ''));
        sessionStorage.setItem('phone', get(res, 'data.phone', ''));
        sessionStorage.setItem('idCard', get(res, 'data.idCard', ''));
        sessionStorage.setItem('userName', get(res, 'data.userName', ''));
        tokenVerifyServies(res);
      }
      console.log('res-----getScanStatusServies', dingTime);
    } catch (err) {
      console.log('err---getScanStatus', err);
      setDingLoad(false);
      // console.log('dingTime===',dingTime)
      clearTimeout(dingTime.load);
      setDingTime({
        load: null,
        num: 0,
      });
    }
  };
  // 监测dingding计时器
  useEffect(() => {
    console.log('dingTime.num===', dingTime.num);
    if (dingTime.num === 60) {
      setDingLoad(false);
      clearTimeout(dingTime.load);
      setDingTime({
        load: null,
        num: 0,
      });
    }
  }, [dingTime.num]);

  useEffect(() => {
    clearTimeout(dingTime.load);
    setDingTime({
      load: null,
      num: 0,
    });

    // getConfig().then((res) => {
    //   if (res.data?.configList?.filter((v) => v.key === 'path')[0]?.value) {
    //     setPathSci(res.data?.configList?.filter((v) => v.key === 'path')[0].value);
    //   }
    //   if (res.data?.configList?.filter((v) => v.key === 'cert')[0]?.value) {
    //     authKey.key = res.data?.configList.filter((v) => v.key === 'cert')[0].value;
    //     setAuthKey({ ...authKey });
    //   }
    // });
    // checkUpdates().then((res) => {
    //   setUpdate(res);
    //   !!res &&
    //     setInterval(() => {
    //       percent < 100 && (percent = percent + 1);
    //       setPercentNum(percent);
    //     }, 1800);
    // });
  }, []);

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        {/* <Tab key="account" tab="账户密码登录"> */}
        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage content="账户或密码错误（admin/ant.design）" />
        )}

        <UserName
          name="employeeCode"
          placeholder="用户名: admin or user"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="密码: ant.design"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        {/* </Tab> */}
        {/* <Tab key="phone" tab="手机号登录">
          {status === 'error' && loginType === 'phone' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="phone"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1[3456789]\d{9}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            smsType={'1'}
            name="verificationCode"
            placeholder="验证码"
            countDown={60}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <Tab key="dingding" tab="钉钉登录">
          <Alert message="请先上传证书" type="info" showIcon />
          <div className={styles.dingBox}>
            <img src={dingCode?.qrCodeUrlBase64Str} />
            {!dingLoad && (
              <div
                className={styles.dingLoadBox}
                onClick={() => {
                  !dingLoad && getQrCodeInfoServies();
                }}
              >
                <ReloadOutlined className={styles.dingLoad} />
              </div>
            )}
          </div>
        </Tab> */}

        <div className={type === 'dingding' ? styles.dingContent : ''}>
          <div className={styles.configs}>
            {/* <Upload {...upProps}>
              <Button>上传证书</Button>
            </Upload> */}
            {/* {type === 'account' && <a onClick={() => setForgetPassModal(true)}>忘记密码</a>} */}
          </div>

          {type !== 'dingding' && <Submit loading={submitting}>登录</Submit>}

          {/* <div className={styles.configsRt}>
            <span>当前网络环境：</span>
            <Select
              value={pathSci}
              onChange={(val) => {
                if (process.env.API_ENV === 'fyprod') {
                  setConfig({ key: 'path', value: val }).then(() => {});
                }
                setPathSci(val);
              }}
            >
              {pathSciList?.map((ps) => (
                <Option value={ps.val} key={ps.val}>
                  {ps.name}
                </Option>
              ))}
            </Select>
          </div> */}
        </div>
      </LoginForm>
      {/*修改密码*/}
      <Modal
        visible={changePassModal}
        title="修改密码"
        width={530}
        centered
        maskClosable={false}
        onOk={() => {
          changePassModalForm.submit();
        }}
        onCancel={() => {
          setChangePassModal(false);
        }}
      >
        <Form
          form={changePassModalForm}
          labelCol={{ flex: '80px' }}
          onFinish={() => {
            changePassModalFormFinish();
          }}
          initialValues={{}}
        >
          <Row gutter="24">
            <Form.Item name="userId" hidden>
              <div />
            </Form.Item>

            <Col span={24}>
              <Form.Item label="原密码" name="password" rules={[{ required: true }]}>
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="新密码"
                name="newPassword"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,16}$/,
                    message:
                      '密码长度为8-16位，最少由数字、大写字母、小写字母、特殊字符中的三种组成！',
                  },
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="确定密码"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('确定密码和新密码不相同!');
                    },
                  }),
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="手机号" name="phone">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              {/*<Form.Item label="验证码">*/}
              {/*<Input />*/}
              <Captcha
                smsType={'3'}
                label={'验证码'}
                size="middle"
                name="verificationCode"
                placeholder="验证码"
                countDown={60}
                getCaptchaButtonText=""
                getCaptchaSecondText="秒"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
              />
              {/*</Form.Item>*/}
            </Col>
          </Row>
        </Form>
      </Modal>

      {/*忘记密码*/}
      <Modal
        visible={forgetPassModal}
        title="忘记密码"
        width={530}
        centered
        maskClosable={false}
        onOk={() => {
          forgetPassModalForm.submit();
        }}
        onCancel={() => {
          setForgetPassModal(false);
        }}
      >
        <Form
          form={forgetPassModalForm}
          labelCol={{ flex: '80px' }}
          onFinish={() => {
            forgetPassModalFormFinish();
          }}
          initialValues={{}}
        >
          <Row gutter="24">
            <Form.Item name="userId" hidden>
              <div />
            </Form.Item>

            <Col span={24}>
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Captcha
                smsType={'4'}
                label={'验证码'}
                size="middle"
                name="verificationCode"
                placeholder="验证码"
                countDown={60}
                getCaptchaButtonText=""
                getCaptchaSecondText="秒"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
              />
            </Col>

            <Col span={24}>
              <Form.Item
                label="新密码"
                name="password"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,16}$/,
                    message:
                      '密码长度为8-16位，最少由数字、大写字母、小写字母、特殊字符中的三种组成！',
                  },
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="确定密码"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('确定密码和新密码不相同!');
                    },
                  }),
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
  // submitting:loading.effects['login/cloudLoginData'],
}))(Login);
