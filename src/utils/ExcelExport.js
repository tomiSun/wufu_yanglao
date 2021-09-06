// Excel导出
export const excelExport = async ({ api, ids, fileName }) => {
  if (!ids?.length) {
    message.error('请选择要导出的项目');
    return;
  }
  let url = `/api${api}?ids=${ids}`;
  var xhr = new XMLHttpRequest();
  xhr.open('get', url, true); // get、post都可
  xhr.responseType = 'blob'; // 转换流
  xhr.setRequestHeader('Authorization', sessionStorage.getItem('Authorization')); // token键值对
  xhr.onload = function () {
    if (this.status == 200) {
      var blob = this.response;
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);
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
