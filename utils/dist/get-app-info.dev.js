"use strict";

var axios = require('axios')["default"];

var config = require('../config');

var envUtils = require('../utils/env');

module.exports = function _callee(appId, options) {
  var url, token, response, resData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = "".concat(config.api_domain).concat(config.path.getAppInfo, "?appId=").concat(appId);
          token = envUtils.getEnv(config.env.token);
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.get(url, {
            headers: {
              'cache-control': 'no-cache',
              Authorization: "Bearer ".concat(token)
            },
            withCredentials: true
          }));

        case 4:
          response = _context.sent;
          resData = response.data;

          if (!(resData && resData.err >= 0)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", resData.data);

        case 8:
          if (!(resData.err === config.error_code.permission_denied)) {
            _context.next = 10;
            break;
          }

          throw new Error(config.error_msg.permission_denied);

        case 10:
          throw new Error(JSON.stringify(response.data));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};