"use strict";

var axios = require('axios');

var envUtils = require('../../utils/env');

var config = require('../../config');

var env = envUtils.getEnv('NODE_ENV') || 'production';

module.exports = function () {
  var apiRequestLogin = "".concat(config.api_domain).concat(config.path.requestLogin);
  var apiCheckStatusLogin = "".concat(config.api_domain).concat(config.path.checkLoginStatus);

  var getQRCode = function getQRCode(appId) {
    return axios({
      method: 'get',
      url: "".concat(apiRequestLogin, "?appId=").concat(appId),
      headers: {
        'cache-control': 'no-cache'
      },
      withCredentials: true
    });
  };

  var checkStatus = function checkStatus(zmpsk) {
    return axios({
      method: 'get',
      url: "".concat(apiCheckStatusLogin, "?zmpsk=").concat(zmpsk),
      headers: {
        'cache-control': 'no-cache'
      },
      withCredentials: true
    });
  };

  return {
    getQRCode: getQRCode,
    checkStatus: checkStatus
  };
}();