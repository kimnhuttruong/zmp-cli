#!/usr/bin/env node
/* eslint no-console: off */
const chalk = require('chalk');
const ora = require('ora');
const jwt = require('jsonwebtoken');
const qrcode = require('qrcode-terminal');
const logSymbols = require('log-symbols');
const config = require('../config');
const envUtils = require('../utils/env');
const log = require('../utils/log');
const zaloLogin = require('./utils/zalo-login');
const { axiosClient } = require('../utils/axios');

const waitText = chalk.gray('Login...');
const spinner = ora(waitText);

module.exports = async (options = {}, logger, { exitOnError = true } = {}) => {
  function errorExit(err) {
    log.error(err.stderr || err);
    if (exitOnError) process.exit(1);
  }
  if (!logger) {
    // eslint-disable-next-line
    logger = {
      statusStart() {},
      statusDone() {},
      statusText() {},
      statusError() {},
      text() {},
      error() {},
    };
  }
  logger.statusStart(waitText);
  spinner.start();
  const loginMethod = options.loginMethod;
  const appId = options.appId || envUtils.getEnv(config.env.appId);
  const token = options.token;

  const apiLogin = `${config.api_domain}${config.path.login}`;

  let intervalCheckLogin;
  try {
    spinner.start();
    if (loginMethod === 'zalo') {
      let zmpsk;
      await new Promise((resolve, reject) => {
        zaloLogin
          .getQRCode(appId)
          .then(function (response) {
            //handle success
            spinner.stop();
            const resData = response.data;
            if (!resData || resData.err < 0) {
              return reject(new Error(resData.msg));
            }
            const loginUrl = resData.data && resData.data.loginUrl;
            // const loginUrl = 'jaflksdjfalksdjfalksd'
            zmpsk = resData.data && resData.data.zmpsk;
            qrcode.generate(loginUrl, { small: true }, function (qrcode) {
              const qrCode = `${logSymbols.info} ${chalk.bold(
                `Scan the QR code with Zalo app:\n${qrcode}`
              )}`;
              logger.text(qrCode);
            });
            envUtils.setEnv(config.env.appId, appId);
            return resolve();
          })
          .catch(function (error) {
            //handle error
            spinner.stop();
            return reject(error);
          });
      });
      await new Promise((resolve, reject) => {
        if (!zmpsk) return reject(new Error('Token Invalid!'));
        let count = 0;

        intervalCheckLogin = setInterval(() => {
          logger.statusText(`${waitText} (Time out after ${60 - count}s)`);
          if (count > 60) {
            clearInterval(intervalCheckLogin);
            return reject(new Error(config.error_msg.request_timeout));
          }
          count++;
          zaloLogin
            .checkStatus(zmpsk)
            .then(function (response) {
              //handle success
              spinner.stop();
              const resData = response.data;
              if (
                resData &&
                resData.err === config.error_code.permission_denied
              ) {
                clearInterval(intervalCheckLogin);
                return reject(new Error(config.error_msg.permission_denied));
              }

              if (
                resData &&
                resData.err === config.error_code.request_timeout
              ) {
                clearInterval(intervalCheckLogin);
                return reject(new Error(config.error_msg.request_timeout));
              }

              if (resData && resData.err >= 0) {
                clearInterval(intervalCheckLogin);
                const token = resData.data && resData.data.jwt;
                envUtils.setEnv(config.env.token, token);
                logger.statusDone('Login Success!');
                return resolve();
              }
            })
            .catch(function (error) {
              //handle error
              clearInterval(intervalCheckLogin);
              spinner.stop();
              return reject(error);
            });
        }, 2000);
      });
    } else {
      await new Promise((resolve, reject) => {
        axiosClient({
          method: 'get',
          url: `${apiLogin}?accessToken=${token}&appId=${appId}`,
          headers: {
            'cache-control': 'no-cache',
          },
          withCredentials: true,
        })
          .then(function (response) {
            //handle success
            spinner.stop();
            const resData = response.data;
            if (!resData || resData.err < 0) {
              return reject(new Error(resData.msg));
            }
            const token = resData.data && resData.data.jwt;
            try {
              const dataDecoded = jwt.decode(token);
              envUtils.setEnv(config.env.appId, dataDecoded.appId);
              envUtils.setEnv(config.env.token, token);
            } catch (error) {
              return reject(error);
            }
            logger.statusDone('Login Success!');
            return resolve();
          })
          .catch(function (error) {
            //handle error
            spinner.stop();
            return reject(error);
          });
      });
    }
  } catch (err) {
    logger.statusError('Login failed!');
    errorExit(err);
    return;
  }
};
