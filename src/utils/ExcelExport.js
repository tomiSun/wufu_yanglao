import { AutoComplete, message, Modal } from 'antd';
/**
 * Excel导出
 * @param {api} 接口路径
 * @param {ids} 勾选行的id数组
 * @param {fileName} 导出excel的名字
 */

export const excelExport = async ({ api, ids, fileName }) => {
  if (!ids?.length) {
    message.error('请选择要导出的项目');
    return;
  }
  const urlPre = `${window.location.origin}/api`;
  const url = `${urlPre}${api}?ids=${ids}`;
  const xhr = new XMLHttpRequest();
  xhr.open('get', url, true); // get、post都可
  xhr.responseType = 'blob'; // 转换流
  xhr.setRequestHeader('Authorization', sessionStorage.getItem('Authorization')); // token键值对
  xhr.onload = function () {
    if (this.status == 200) {
      const blob = this.response;
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${fileName}.xlsx`; // 文件名
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  setTimeout(() => {
    xhr.send();
  }, 100);
};

// 使用示例
// import { excelExport } from '@/utils/ExcelExport';
// excelExport({
//   api: '/blood-sugar/export',//导出接口路径
//   ids: '487207946229518336',//勾选的行id数组集合
//   fileName: '三测单',//导出文件名称
// });
const paramsToUrl = (obj) => {
  const keys = Object.keys(obj);
  return (
    keys?.reduce((res, key, index) => {
      if (index === 0) {
        res += `?${key}=${obj[key] || ''}`;
      } else {
        res += `&${key}=${obj[key] || ''}`;
      }
      return res;
    }, '') || ''
  );
};
/**
 * 打开模态框
 * @param {object} data 表单数据
 * @param {object} emitFormData dva state
 */
export const openModal = (props) => {
  const { url, params, type = 'info' } = props;
  const urlPre = `${window.location.protocol}//${window.location.hostname}:8082`;
  // const urlPre = `http://120.27.222.210:8082`;
  // const urlPre = `http://192.168.1.160:8082`;
  const urlLast = (params && paramsToUrl(params)) || '';
  console.log('realUrl: ', `${urlPre}${url}${urlLast}`);
  const config = {
    title: '打印预览',
    icon: null,
    closable: true,
    content: (
      <div style={{ width: '794px', height: '500px', overflow: 'hidden' }}>
        <iframe
          scrolling="yes"
          frameBorder="0"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          src={`${urlPre}${url}${urlLast}`}
        />
      </div>
    ),
    okText: '取消',
    // cancelText: '取消',
    width: 820,
    // height: 900,
    ...props,
  };
  Modal[type](config);
};
// 使用示例
// import { excelExport,openModal } from '@/utils/ExcelExport';
// openModal({
//   url: '/report/jmreport/view/563206615924539392?start=2022/02/15&end=2022/02/15',//拼接后的报表地址
// });
