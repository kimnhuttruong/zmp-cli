const Resumable = require('../../utils/resumable');
const chalk = require('chalk');
const config = require('../../config');
const envUtils = require('../../utils/env');
const File = require('file-api').File;
const FormData = require('form-data');
const _ = require('lodash');

module.exports = async function (data, options, logger) {
  const apiDomain = config.api_domain;

  const uploadAppByChunk = (resumable, bufferData) => {
    return new Promise((resolve, reject) => {
      try {
        var file = new File({
          name: 'www.zip', // required
          buffer: bufferData,
        });

        resumable.on('fileAdded', function () {
          resumable.upload();
        });
        resumable.on('complete', function () {
          return resolve();
        });
        resumable.on('fileError', function (file, message) {
          return reject(new Error(`Error upload app: ${message}`));
        });
        resumable.on('cancel', function () {
          return reject(new Error('Error upload app: cancel'));
        });
        resumable.on('fileSuccess', function (file, message) {
          const resData = JSON.parse(message);
          if (_.isNumber(resData.err) && resData.err < 0) {
            return reject(new Error(`Error upload app: ${message}`));
          }
          return resolve(resData);
        });

        resumable.addFile(file);
      } catch (error) {
        return reject(error);
      }
    });
  };

  const apiUploadAppByChunk = `${apiDomain}${config.path.uploadAppByChunk}`;

  const { appName, appDesc, appBuffer, appConfig, identifier } = data;
  const token = envUtils.getEnv(config.env.token);

  const resumable = new Resumable({
    ...config.resumable_option,
    target: apiUploadAppByChunk,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    generateUniqueIdentifier: () => identifier,
  });
  const formData = new FormData();
  formData.append('zipFile', appBuffer);
  formData.append('name', appName);
  formData.append('desc', appDesc);
  formData.append('config', appConfig);

  // Resumable.js isn't supported!
  if (!resumable.support) {
    logger.statusError('Does not support upload app');
  } else {
    let i = 0;
    resumable.on('fileProgress', function (file) {
      i = Math.round(file.progress() * 100) % (100 + 1);
      const chunks = new Array(i + 1).join('|');
      logger.statusText(
        `Deploying Your App ${chalk.gray(
          '\n' + chunks + ' ' + Math.round(file.progress() * 100) + '%'
        )}`
      );
    });
    return await uploadAppByChunk(resumable, appBuffer);
  }
};
