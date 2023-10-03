const config = require('../../config');
const { axiosClient } = require('../../utils/axios');

module.exports = (function () {
  const apiRequestLogin = `${config.api_domain}${config.path.requestLogin}`;

  const apiCheckStatusLogin = `${config.api_domain}${config.path.checkLoginStatus}`;
  const getQRCode = (appId) => {
    return axiosClient({
      method: 'get',
      url: `${apiRequestLogin}?appId=${appId}`,
      headers: {
        'cache-control': 'no-cache',
      },
      withCredentials: true,
    });
  };
  const checkStatus = (zmpsk) => {
    return axiosClient({
      method: 'get',
      url: `${apiCheckStatusLogin}?zmpsk=${zmpsk}`,
      headers: {
        'cache-control': 'no-cache',
      },
      withCredentials: true,
    });
  };
  return {
    getQRCode,
    checkStatus,
  };
})();
