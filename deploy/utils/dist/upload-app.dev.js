"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Resumable = require('../../utils/resumable');

var chalk = require('chalk');

var config = require('../../config');

var envUtils = require('../../utils/env');

var File = require('file-api').File;

var FormData = require('form-data');

var _ = require('lodash');

module.exports = function _callee(data, options, logger) {
  var apiDomain, uploadAppByChunk, apiUploadAppByChunk, appName, appDesc, appBuffer, appConfig, identifier, token, resumable, formData, i;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          apiDomain = config.api_domain;

          uploadAppByChunk = function uploadAppByChunk(resumable, bufferData) {
            return new Promise(function (resolve, reject) {
              try {
                var file = new File({
                  name: 'www.zip',
                  // required
                  buffer: bufferData
                });
                resumable.on('fileAdded', function () {
                  resumable.upload();
                });
                resumable.on('complete', function () {
                  return resolve();
                });
                resumable.on('fileError', function (file, message) {
                  return reject(new Error("Error upload app: ".concat(message)));
                });
                resumable.on('cancel', function () {
                  return reject(new Error('Error upload app: cancel'));
                });
                resumable.on('fileSuccess', function (file, message) {
                  var resData = JSON.parse(message);

                  if (_.isNumber(resData.err) && resData.err < 0) {
                    return reject(new Error("Error upload app: ".concat(message)));
                  }

                  return resolve(resData);
                });
                resumable.addFile(file);
              } catch (error) {
                return reject(error);
              }
            });
          };

          apiUploadAppByChunk = "".concat(apiDomain).concat(config.path.uploadAppByChunk);
          appName = data.appName, appDesc = data.appDesc, appBuffer = data.appBuffer, appConfig = data.appConfig, identifier = data.identifier;
          token = envUtils.getEnv(config.env.token);
          resumable = new Resumable(_objectSpread({}, config.resumable_option, {
            target: apiUploadAppByChunk,
            headers: {
              Authorization: "Bearer ".concat(token)
            },
            generateUniqueIdentifier: function generateUniqueIdentifier() {
              return identifier;
            }
          }));
          formData = new FormData();
          formData.append('zipFile', appBuffer);
          formData.append('name', appName);
          formData.append('desc', appDesc);
          formData.append('config', appConfig); // Resumable.js isn't supported!

          if (resumable.support) {
            _context.next = 15;
            break;
          }

          logger.statusError('Does not support upload app');
          _context.next = 20;
          break;

        case 15:
          i = 0;
          resumable.on('fileProgress', function (file) {
            i = Math.round(file.progress() * 100) % (100 + 1);
            var chunks = new Array(i + 1).join('|');
            logger.statusText("Deploying Your App ".concat(chalk.gray('\n' + chunks + ' ' + Math.round(file.progress() * 100) + '%')));
          });
          _context.next = 19;
          return regeneratorRuntime.awrap(uploadAppByChunk(resumable, appBuffer));

        case 19:
          return _context.abrupt("return", _context.sent);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
};