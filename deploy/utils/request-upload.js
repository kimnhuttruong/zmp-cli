const { axiosClient } = require('../../utils/axios');
const config = require('../../config');

const requestUpload = async (url, appData, versionStatus, token) => {
  const { appName, appDesc, appConfig, frameworkVersions } = appData;

  const params = {
    name: appName,
    desc: appDesc,
    config: appConfig,
    versionStatus,
    frameworkVersions,
  };
  const headers = {
    Authorization: `Bearer ${token}`,
    'cache-control': 'no-cache',
  };
  const res = await axiosClient.get(url, {
    params,
    headers,
    withCredentials: true,
  });

  const resData = res.data;
  if (!resData || resData.err < 0) {
    if (resData && resData.err === config.error_code.permission_denied) {
      throw new Error(config.error_msg.permission_denied);
    }
    throw new Error(JSON.stringify(resData));
  }
  return resData.data;
};

module.exports = requestUpload;
