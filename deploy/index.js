#!/usr/bin/env node
/* eslint no-console: off */
const chalk = require('chalk');
const path = require('path');
const zipper = require('zip-local');
const logSymbols = require('log-symbols');
const qrcode = require('qrcode-terminal');
const config = require('../config');
const buildApp = require('../build/index');
const envUtils = require('../utils/env');
const uploadApp = require('./utils/upload-app');
const fse = require('../utils/fs-extra');
const requestUpload = require('./utils/request-upload');

const waitText = chalk.gray('(Please wait, it can take a while)');
const defaultLogger = {
  statusStart() {},
  statusDone() {},
  statusText() {},
  statusError() {},
  text() {},
  error() {},
  showOnUI() {},
};

module.exports = async (
  options = {},
  logger = defaultLogger,
  { exitOnError = true } = {}
) => {
  const cwd = options.cwd || process.cwd();
  const outputDir = options.outputDir || 'www';
  const apiDomain = config.api_domain;
  const resolvePath = (dir) => {
    return path.join(cwd, dir);
  };
  function errorExit(err) {
    logger.error(err.stderr || err);
    if (exitOnError) process.exit(1);
  }

  const token = envUtils.getEnv(config.env.token);
  const appConfigFilename = config.filename.appConfig;
  const packageJsonFilename = config.filename.packageJson;

  let appConfigJson;
  try {
    appConfigJson = require(resolvePath(appConfigFilename));
  } catch (err) {
    errorExit(new Error(config.error_msg.app_config_not_found));
  }

  let packageJson;
  const frameworkVersions = {};
  try {
    packageJson = require(resolvePath(packageJsonFilename));
    const dependencies = packageJson.dependencies;
    Object.entries(dependencies).forEach(([key, value]) => {
      if (key.includes('zmp') || key.includes('react')) {
        frameworkVersions[key] = value;
      }
    });
  } catch (err) {
    // pass
  }
  const dataRequest = {
    appName: appConfigJson.app.title,
    appDesc: options.desc || 'Update app with new version',
    appConfig: JSON.stringify(appConfigJson),
    frameworkVersions: JSON.stringify(frameworkVersions),
  };

  let nextVersion;
  let identifier;
  try {
    const urlRequestUpload = `${apiDomain}${config.path.requestUploadResumable}`;
    const requestUploadData = await requestUpload(
      urlRequestUpload,
      dataRequest,
      options.versionStatus,
      token
    );
    nextVersion = requestUploadData.nextVersion;
    identifier = requestUploadData.identifier;
  } catch (err) {
    errorExit(err);
  }
  if (options.customProject) {
    let flag = 0;
    if (appConfigJson.listSyncJS && appConfigJson.listSyncJS.length > 0)
      flag += 1;
    if (appConfigJson.listAsyncJS && appConfigJson.listAsyncJS.length > 0)
      flag += 1;
    if (flag === 0) {
      errorExit(
        new Error(
          'Please define your assets output at app-config.json. Read more: https:/'
        )
      );
    }
    fse.writeFileSync(
      resolvePath(`${outputDir}/${config.filename.appConfig}`),
      JSON.stringify(appConfigJson)
    );
  } else {
    appConfigJson = await buildApp(
      { ...options, appConfigJson, nextVersion },
      logger
    );
  }

  logger.statusStart(`Deploying Your App ${waitText}`);
  try {
    const buffer = await new Promise((resolve, reject) => {
      zipper.zip(resolvePath(outputDir), function (zipError, zipped) {
        if (zipError) return reject(zipError);
        zipped.compress();
        return resolve(zipped.memory());
      });
    });
    const uploadData = {
      ...dataRequest,
      appBuffer: buffer,
      identifier,
    };
    const uploadRes = await uploadApp(uploadData, options, logger);
    const appURL = uploadRes && uploadRes.data && uploadRes.data.appUrl;
    qrcode.generate(appURL, { small: true }, function (qrcode) {
      const qrCode = `${chalk.bold(
        `${logSymbols.info} View app at:\n${qrcode}`
      )}`;
      logger.statusDone(`${chalk.bold.green('Deploy Done!')} 💪`);
      logger.text(qrCode);
    });
  } catch (err) {
    logger.statusError('Error deploying your app');
    errorExit(err);
  }
};
