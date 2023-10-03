#!/usr/bin/env node

/* eslint no-console: off */
"use strict";

var chalk = require('chalk');

var ora = require('ora');

var jwt = require('jsonwebtoken');

var axios = require('axios');

var qrcode = require('qrcode-terminal');

var logSymbols = require('log-symbols');

var config = require('../config');

var envUtils = require('../utils/env');

var log = require('../utils/log');

var zaloLogin = require('./utils/zalo-login');

var env = envUtils.getEnv('NODE_ENV') || 'production';
var waitText = chalk.gray('Login...');
var spinner = ora(waitText);

module.exports = function _callee() {
  var options,
      logger,
      _ref,
      _ref$exitOnError,
      exitOnError,
      errorExit,
      cwd,
      loginMethod,
      appId,
      token,
      apiLogin,
      intervalCheckLogin,
      zmpsk,
      _args = arguments;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errorExit = function _ref2(err) {
            log.error(err.stderr || err);
            if (exitOnError) process.exit(1);
          };

          options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
          logger = _args.length > 1 ? _args[1] : undefined;
          _ref = _args.length > 2 && _args[2] !== undefined ? _args[2] : {}, _ref$exitOnError = _ref.exitOnError, exitOnError = _ref$exitOnError === void 0 ? true : _ref$exitOnError;

          if (!logger) {
            // eslint-disable-next-line
            logger = {
              statusStart: function statusStart() {},
              statusDone: function statusDone() {},
              statusText: function statusText() {},
              statusError: function statusError() {},
              text: function text() {},
              error: function error() {}
            };
          }

          logger.statusStart(waitText);
          spinner.start();
          cwd = options.cwd || process.cwd();
          loginMethod = options.loginMethod;
          appId = options.appId || envUtils.getEnv(config.env.appId);
          token = options.token;
          apiLogin = "".concat(config.api_domain).concat(config.path.login);
          _context.prev = 12;
          spinner.start();

          if (!(loginMethod === 'zalo')) {
            _context.next = 21;
            break;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            zaloLogin.getQRCode(appId).then(function (response) {
              //handle success
              spinner.stop();
              var resData = response.data;

              if (!resData || resData.err < 0) {
                return reject(new Error(resData.msg));
              }

              var loginUrl = resData.data && resData.data.loginUrl; // const loginUrl = 'jaflksdjfalksdjfalksd'

              zmpsk = resData.data && resData.data.zmpsk;
              qrcode.generate(loginUrl, {
                small: true
              }, function (qrcode) {
                var qrCode = "".concat(logSymbols.info, " ").concat(chalk.bold("Scan the QR code with Zalo app:\n".concat(qrcode)));
                logger.text(qrCode);
              });
              envUtils.setEnv(config.env.appId, appId);
              return resolve();
            })["catch"](function (error) {
              //handle error
              spinner.stop();
              return reject(error);
            });
          }));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            if (!zmpsk) return reject(new Error('Token Invalid!'));
            var count = 0;
            intervalCheckLogin = setInterval(function () {
              logger.statusText("".concat(waitText, " (Time out after ").concat(60 - count, "s)"));

              if (count > 60) {
                clearInterval(intervalCheckLogin);
                return reject(new Error(config.error_msg.request_timeout));
              }

              count++;
              zaloLogin.checkStatus(zmpsk).then(function (response) {
                //handle success
                spinner.stop();
                var resData = response.data;

                if (resData && resData.err === config.error_code.permission_denied) {
                  clearInterval(intervalCheckLogin);
                  return reject(new Error(config.error_msg.permission_denied));
                }

                if (resData && resData.err === config.error_code.request_timeout) {
                  clearInterval(intervalCheckLogin);
                  return reject(new Error(config.error_msg.request_timeout));
                }

                if (resData && resData.err >= 0) {
                  clearInterval(intervalCheckLogin);

                  var _token = resData.data && resData.data.jwt;

                  envUtils.setEnv(config.env.token, _token);
                  envUtils.setEnv(config.env.accessToken, _token);
                  logger.statusDone('Login Success!');
                  return resolve();
                }
              })["catch"](function (error) {
                //handle error
                clearInterval(intervalCheckLogin);
                spinner.stop();
                return reject(error);
              });
            }, 2000);
          }));

        case 19:
          _context.next = 23;
          break;

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            axios({
              method: 'get',
              url: "".concat(apiLogin, "?accessToken=").concat(token, "&appId=").concat(appId),
              headers: {
                'cache-control': 'no-cache'
              },
              withCredentials: true
            }).then(function (response) {
              //handle success
              spinner.stop();
              var resData = response.data;

              if (!resData || resData.err < 0) {
                return reject(new Error(resData.msg));
              }

              var token = resData.data && resData.data.jwt;

              try {
                var dataDecoded = jwt.decode(token);
                envUtils.setEnv(config.env.appId, dataDecoded.appId);
                envUtils.setEnv(config.env.token, token);
                envUtils.setEnv(config.env.accessToken, options.token);
              } catch (error) {
                return reject(error);
              }

              logger.statusDone('Login Success!');
              return resolve();
            })["catch"](function (error) {
              //handle error
              spinner.stop();
              return reject(error);
            });
          }));

        case 23:
          _context.next = 30;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](12);
          logger.statusError('Login failed!');
          errorExit(_context.t0);
          return _context.abrupt("return");

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[12, 25]]);
};