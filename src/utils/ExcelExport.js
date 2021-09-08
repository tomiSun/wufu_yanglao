/**
 * Excel导出
 * @param {api} 接口路径
 * @param {ids} 勾选行的id数组
 * @param {fileName} 导出excel的名字
 */
import { message } from 'antd';

export const excelExport = async ({ api, ids, fileName }) => {
  if (!ids?.length) {
    message.error('请选择要导出的项目');
    return;
  }
  const urlPre = window.location.origin + '/api';
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
