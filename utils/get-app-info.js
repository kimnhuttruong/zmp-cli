const config = require('../config');
const envUtils = require('../utils/env');
const { axiosClient } = require('./axios');

module.exports = async function (appId) {
  const url = `${config.api_domain}${config.path.getAppInfo}?appId=${appId}`;
  const token = envUtils.getEnv(config.env.token);
  const response = await axiosClient.get(url, {
    headers: {
      'cache-control': 'no-cache',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  const resData = response.data;
  if (resData && resData.err >= 0) {
    return resData.data;
  }
  if (resData.err === config.error_code.permission_denied)
    throw new Error(config.error_msg.permission_denied);
  throw new Error(JSON.stringify(response.data));
};
