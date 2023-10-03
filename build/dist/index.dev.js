#!/usr/bin/env node

/* eslint no-console: off */
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var chalk = require('chalk');

var ora = require('ora');

var path = require('path');

var _require = require('vite'),
    build = _require.build;

var dynamicImportVars = require('@rollup/plugin-dynamic-import-vars')["default"];

var _ = require('lodash');

var replace = require('@rollup/plugin-replace');

var log = require('../utils/log');

var fse = require('../utils/fs-extra');

var getAppInfo = require('../utils/get-app-info');

var envUtils = require('../utils/env');

var config = require('../config');

var generatePagesMap = require('../utils/generate-pages-map');

var env = envUtils.getEnv('NODE_ENV') || 'production';
var waitText = chalk.gray('Building... (Please wait, it can take a while)');
var frameworkWarning = chalk.yellow('Warning: This CLI version will work better with zmp-framework version 1.5.0 or higher');
var spinner = ora(env === 'production' ? 'Building for production...' : 'Building development version...');

module.exports = function _callee() {
  var options,
      logger,
      _ref,
      _ref$exitOnError,
      exitOnError,
      cwd,
      resolvePath,
      appConfig,
      errorExit,
      appId,
      nextVersion,
      appInfo,
      currentVersion,
      viteConfig,
      isTypeScriptProject,
      res,
      output,
      jsFiles,
      cssFiles,
      appConfigJson,
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
          cwd = options.cwd || process.cwd();

          resolvePath = function resolvePath(dir) {
            return path.join(cwd, dir);
          };

          appConfig = options.appConfigJson || require(resolvePath(config.filename.appConfig));

          if (!logger) {
            // eslint-disable-next-line
            logger = {
              statusStart: function statusStart() {},
              statusDone: function statusDone() {},
              statusError: function statusError() {},
              text: function text() {},
              error: function error() {}
            };
          }

          logger.text(frameworkWarning);
          spinner.start();
          logger.statusStart(waitText);
          _context.prev = 11;
          appId = envUtils.getEnv(config.env.appId);
          nextVersion = options.nextVersion;

          if (nextVersion) {
            _context.next = 21;
            break;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap(getAppInfo(appId, options));

        case 17:
          appInfo = _context.sent;
          currentVersion = appInfo && appInfo.latestVersion && Number(appInfo.latestVersion);

          if (currentVersion === undefined || currentVersion === null) {
            currentVersion = 0;
          }

          nextVersion = currentVersion + 1;

        case 21:
          viteConfig = 'vite.config.js';
          isTypeScriptProject = fse.existsSync(path.join(cwd, 'vite.config.ts'));

          if (isTypeScriptProject) {
            viteConfig = 'vite.config.ts';
          } // eslint-disable-next-line


          _context.next = 26;
          return regeneratorRuntime.awrap(build({
            configFile: path.join(cwd, viteConfig),
            root: cwd,
            base: "".concat(config.zdn_url).concat(appId, "/").concat(nextVersion, "/"),
            css: {
              modules: {
                scopeBehaviour: 'local'
              }
            },
            build: {
              target: 'es2015',
              outDir: path.join(cwd, 'www'),
              assetsInlineLimit: 0,
              cssCodeSplit: false,
              cssTarget: ['es2015', 'safari13.1'],
              rollupOptions: {
                plugins: [replace({
                  values: {
                    ZMP_IMPORT_PAGES: function ZMP_IMPORT_PAGES() {
                      return generatePagesMap(cwd);
                    }
                  }
                }), dynamicImportVars({
                  warnOnError: true
                })],
                output: {
                  entryFileNames: 'assets/[name].[hash].module.js',
                  chunkFileNames: 'assets/[name].[hash].module.js'
                }
              }
            },
            logLevel: 'error'
          }));

        case 26:
          res = _context.sent;
          output = res.output.map(function (obj) {
            return _.pick(obj, ['fileName', 'type', 'isEntry', 'isImplicitEntry', 'isDynamicEntry']);
          });
          jsFiles = output.filter(function (file) {
            if (file.type !== 'chunk') return false;
            return file.isEntry || !file.isDynamicEntry;
          });
          cssFiles = output.filter(function (file) {
            if (file.type !== 'asset' || !file.fileName.endsWith('.css')) return false; // const name = file.fileName.replace(/\.([a-z0-9]{8})\.css$/, '');
            // if (!jsFiles.find((js) => js.fileName.startsWith(name))) return false;

            return true;
          });
          appConfigJson = _objectSpread({}, appConfig, {
            listCSS: [].concat(_toConsumableArray(Array.isArray(appConfig.listCSS) ? appConfig.listCSS : []), _toConsumableArray(cssFiles.map(function (f) {
              return f.fileName;
            }))),
            listSyncJS: [].concat(_toConsumableArray(Array.isArray(appConfig.listSyncJS) ? appConfig.listSyncJS : []), _toConsumableArray(jsFiles.map(function (f) {
              return f.fileName;
            }))),
            listAsyncJS: _toConsumableArray(Array.isArray(appConfig.listAsyncJS) ? appConfig.listAsyncJS : [])
          });
          fse.writeFileSync(resolvePath("www/".concat(config.filename.appConfig)), JSON.stringify(appConfigJson));
          logger.statusDone("".concat(chalk.bold.green('Build Done!\n')));
          return _context.abrupt("return", appConfigJson);

        case 36:
          _context.prev = 36;
          _context.t0 = _context["catch"](11);
          logger.statusError('Error building project'); // if (err) logger.error(err.stderr || err);

          errorExit(_context.t0);
          return _context.abrupt("return");

        case 41:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[11, 36]]);
};