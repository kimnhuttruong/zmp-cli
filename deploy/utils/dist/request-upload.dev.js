"use strict";

var axios = require('axios')["default"];

var config = require('../../config');

var requestUpload = function requestUpload(url, appData, versionStatus, token) {
  var appName, appDesc, appConfig, frameworkVersions, params, headers, res, resData;
  return regeneratorRuntime.async(function requestUpload$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          appName = appData.appName, appDesc = appData.appDesc, appConfig = appData.appConfig, frameworkVersions = appData.frameworkVersions;
          params = {
            name: appName,
            desc: appDesc,
            config: appConfig,
            versionStatus: versionStatus,
            frameworkVersions: frameworkVersions
          };
          headers = {
            Authorization: "Bearer ".concat(token),
            'cache-control': 'no-cache'
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(axios.get(url, {
            params: params,
            headers: headers,
            withCredentials: true
          }));

        case 5:
          res = _context.sent;
          resData = res.data;

          if (!(!resData || resData.err < 0)) {
            _context.next = 11;
            break;
          }

          if (!(resData && resData.err === config.error_code.permission_denied)) {
            _context.next = 10;
            break;
          }

          throw new Error(config.error_msg.permission_denied);

        case 10:
          throw new Error(JSON.stringify(resData));

        case 11:
          return _context.abrupt("return", resData.data);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = requestUpload;