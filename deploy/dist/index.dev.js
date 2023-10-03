#!/usr/bin/env node

/* eslint no-console: off */
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var chalk = require('chalk');

var path = require('path');

var zipper = require('zip-local');

var logSymbols = require('log-symbols');

var qrcode = require('qrcode-terminal');

var config = require('../config');

var buildApp = require('../build/index');

var envUtils = require('../utils/env');

var uploadApp = require('./utils/upload-app');

var fse = require('../utils/fs-extra');

var requestUpload = require('./utils/request-upload');

var waitText = chalk.gray('(Please wait, it can take a while)');
var defaultLogger = {
  statusStart: function statusStart() {},
  statusDone: function statusDone() {},
  statusText: function statusText() {},
  statusError: function statusError() {},
  text: function text() {},
  error: function error() {},
  showOnUI: function showOnUI() {}
};

module.exports = function _callee() {
  var options,
      logger,
      _ref,
      _ref$exitOnError,
      exitOnError,
      cwd,
      outputDir,
      apiDomain,
      resolvePath,
      errorExit,
      token,
      appConfigFilename,
      packageJsonFilename,
      appConfigJson,
      packageJson,
      frameworkVersions,
      dependencies,
      dataRequest,
      nextVersion,
      identifier,
      urlRequestUpload,
      requestUploadData,
      flag,
      buffer,
      uploadData,
      uploadRes,
      appURL,
      _args = arguments;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errorExit = function _ref4(err) {
            logger.error(err.stderr || err);
            if (exitOnError) process.exit(1);
          };

          options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
          logger = _args.length > 1 && _args[1] !== undefined ? _args[1] : defaultLogger;
          _ref = _args.length > 2 && _args[2] !== undefined ? _args[2] : {}, _ref$exitOnError = _ref.exitOnError, exitOnError = _ref$exitOnError === void 0 ? true : _ref$exitOnError;
          cwd = options.cwd || process.cwd();
          outputDir = options.outputDir || 'www';
          apiDomain = config.api_domain;

          resolvePath = function resolvePath(dir) {
            return path.join(cwd, dir);
          };

          token = envUtils.getEnv(config.env.token);
          appConfigFilename = config.filename.appConfig;
          packageJsonFilename = config.filename.packageJson;

          try {
            appConfigJson = require(resolvePath(appConfigFilename));
          } catch (err) {
            errorExit(new Error(config.error_msg.app_config_not_found));
          }

          frameworkVersions = {};

          try {
            packageJson = require(resolvePath(packageJsonFilename));
            dependencies = packageJson.dependencies;
            Object.entries(dependencies).forEach(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 2),
                  key = _ref3[0],
                  value = _ref3[1];

              if (key.includes('zmp') || key.includes('react')) {
                frameworkVersions[key] = value;
              }
            });
          } catch (err) {// pass
          }

          dataRequest = {
            appName: appConfigJson.app.title,
            appDesc: options.desc || 'Update app with new version',
            appConfig: JSON.stringify(appConfigJson),
            frameworkVersions: JSON.stringify(frameworkVersions)
          };
          _context.prev = 15;
          urlRequestUpload = "".concat(apiDomain).concat(config.path.requestUploadResumable);
          _context.next = 19;
          return regeneratorRuntime.awrap(requestUpload(urlRequestUpload, dataRequest, options.versionStatus, token));

        case 19:
          requestUploadData = _context.sent;
          nextVersion = requestUploadData.nextVersion;
          identifier = requestUploadData.identifier;
          _context.next = 27;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](15);
          errorExit(_context.t0);

        case 27:
          if (!options.customProject) {
            _context.next = 35;
            break;
          }

          flag = 0;
          if (appConfigJson.listSyncJS && appConfigJson.listSyncJS.length > 0) flag += 1;
          if (appConfigJson.listAsyncJS && appConfigJson.listAsyncJS.length > 0) flag += 1;

          if (flag === 0) {
            errorExit(new Error('Please define your assets output at app-config.json. Read more: https:/'));
          }

          fse.writeFileSync(resolvePath("".concat(outputDir, "/").concat(config.filename.appConfig)), JSON.stringify(appConfigJson));
          _context.next = 38;
          break;

        case 35:
          _context.next = 37;
          return regeneratorRuntime.awrap(buildApp(_objectSpread({}, options, {
            appConfigJson: appConfigJson,
            nextVersion: nextVersion
          }), logger));

        case 37:
          appConfigJson = _context.sent;

        case 38:
          logger.statusStart("Deploying Your App ".concat(waitText));
          _context.prev = 39;
          _context.next = 42;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            zipper.zip(resolvePath(outputDir), function (zipError, zipped) {
              if (zipError) return reject(zipError);
              zipped.compress();
              return resolve(zipped.memory());
            });
          }));

        case 42:
          buffer = _context.sent;
          uploadData = _objectSpread({}, dataRequest, {
            appBuffer: buffer,
            identifier: identifier
          });
          _context.next = 46;
          return regeneratorRuntime.awrap(uploadApp(uploadData, options, logger));

        case 46:
          uploadRes = _context.sent;
          appURL = uploadRes && uploadRes.data && uploadRes.data.appUrl;
          qrcode.generate(appURL, {
            small: true
          }, function (qrcode) {
            var qrCode = "".concat(chalk.bold("".concat(logSymbols.info, " View app at:\n").concat(qrcode)));
            logger.statusDone("".concat(chalk.bold.green('Deploy Done!'), " \uD83D\uDCAA"));
            logger.text(qrCode);
          });
          _context.next = 55;
          break;

        case 51:
          _context.prev = 51;
          _context.t1 = _context["catch"](39);
          logger.statusError('Error deploying your app');
          errorExit(_context.t1);

        case 55:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[15, 24], [39, 51]]);
};