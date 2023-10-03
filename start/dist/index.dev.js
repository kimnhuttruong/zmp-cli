#!/usr/bin/env node

/* eslint no-console: off */
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var chalk = require('chalk');

var ora = require('ora');

var path = require('path');

var qrcode = require('qrcode-terminal');

var logSymbols = require('log-symbols');

var _require = require('vite'),
    createServer = _require.createServer;

var chii = require('chii');

var config = require('../config');

var envUtils = require('../utils/env');

var fs = require('../utils/fs-extra');

var fse = require('../utils/fs-extra');

var spinner = ora('Starting mini app...');

module.exports = function _callee() {
  var options,
      logger,
      _ref,
      _ref$exitOnError,
      exitOnError,
      errorExit,
      cwd,
      appId,
      previewOnZalo,
      isIOS,
      iosHostName,
      usingFrame,
      host,
      port,
      remoteDebugPort,
      hrConfigPath,
      remoteDebugScript,
      hrConfig,
      fileData,
      _hrConfig,
      listJS,
      remoteDebugScriptIndex,
      localServer,
      publicServer,
      viteConfig,
      isTypeScriptProject,
      server,
      app,
      serverFrame,
      info,
      _info,
      processAdbReverseRemoteDEbug,
      _args = arguments;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errorExit = function _ref2(err) {
            logger.error(err.stderr || err);
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
              statusError: function statusError() {},
              text: function text() {},
              error: function error() {}
            };
          }

          spinner.start();
          cwd = options.cwd || process.cwd();
          appId = options.appId || envUtils.getEnv(config.env.appId);
          previewOnZalo = options.previewOnZalo;
          isIOS = options.ios;
          iosHostName = options.iosHostName;
          usingFrame = options.frame;
          host = isIOS ? iosHostName : 'localhost';
          port = options.port;
          remoteDebugPort = port - 2;
          _context.prev = 15;

          if (previewOnZalo) {
            hrConfigPath = path.join(cwd, 'hr.config.json');
            remoteDebugScript = {
              id: 'remote-debug-script',
              innerHTML: "(function () { var script = document.createElement('script'); script.src='http://".concat(host, ":").concat(remoteDebugPort, "/target.js'; document.body.appendChild(script); })()"),
              type: 'text/javascript'
            };

            if (!fs.existsSync(hrConfigPath)) {
              hrConfig = {
                listCSS: [],
                listJS: [{
                  src: '/src/app.js',
                  type: 'module',
                  async: true
                }, remoteDebugScript]
              };
              fs.writeFileSync(hrConfigPath, JSON.stringify(hrConfig, undefined, 4));
            } else {
              fileData = fs.readFileSync(hrConfigPath);
              _hrConfig = JSON.parse(fileData);
              listJS = _hrConfig.listJS;

              if (!Array.isArray(listJS)) {
                listJS = [];
              }

              remoteDebugScriptIndex = listJS.findIndex(function (js) {
                return js.id === 'remote-debug-script';
              });

              if (remoteDebugScriptIndex <= 0) {
                listJS.push(remoteDebugScript);
              } else {
                listJS.splice(remoteDebugScriptIndex, 1);
                listJS.push(remoteDebugScript);
              }

              _hrConfig.listJS = listJS;
              fs.writeFileSync(hrConfigPath, JSON.stringify(_hrConfig, undefined, 4));
            }
          }

          localServer = {};
          publicServer = {
            host: '0.0.0.0',
            https: !isIOS,
            hmr: {
              host: host
            }
          };
          viteConfig = 'vite.config.js';
          isTypeScriptProject = fse.existsSync(path.join(cwd, 'vite.config.ts'));

          if (isTypeScriptProject) {
            viteConfig = 'vite.config.ts';
          }

          _context.next = 24;
          return regeneratorRuntime.awrap(createServer({
            configFile: path.join(cwd, viteConfig),
            root: cwd,
            mode: previewOnZalo ? 'production' : 'development',
            define: {
              'process.env.NODE_ENV': JSON.stringify(previewOnZalo ? 'production' : 'development'),
              'process.env.previewOnZalo': previewOnZalo
            },
            server: _objectSpread({
              port: usingFrame ? port - 1 : port
            }, previewOnZalo ? publicServer : localServer)
          }));

        case 24:
          server = _context.sent;
          _context.next = 27;
          return regeneratorRuntime.awrap(server.listen());

        case 27:
          app = _context.sent;

          if (previewOnZalo) {
            _context.next = 47;
            break;
          }

          if (!usingFrame) {
            _context.next = 41;
            break;
          }

          _context.next = 32;
          return regeneratorRuntime.awrap(createServer({
            // any valid user config options, plus `mode` and `configFile`
            configFile: false,
            root: __dirname + '/frame',
            server: {
              port: app.httpServer.address().port + 1,
              strictPort: true,
              open: true
            }
          }));

        case 32:
          serverFrame = _context.sent;
          spinner.stop();
          _context.next = 36;
          return regeneratorRuntime.awrap(serverFrame.listen());

        case 36:
          info = serverFrame.config.logger.info;
          info(chalk.green("Zalo Mini App dev server is running at:\n"));
          serverFrame.printUrls();
          _context.next = 45;
          break;

        case 41:
          spinner.stop();
          _info = server.config.logger.info;

          _info(chalk.green("Zalo Mini App dev server is running at:\n"));

          server.printUrls();

        case 45:
          _context.next = 48;
          break;

        case 47:
          try {
            chii.start({
              port: remoteDebugPort
            });
            logger.text(chalk.green("".concat(logSymbols.info, " ").concat(chalk.bold("Remote debugging tool is running at: http://localhost:".concat(remoteDebugPort)))));

            if (!isIOS) {
              processAdbReverseRemoteDEbug = require('child_process').spawn("adb", ['reverse', "tcp:".concat(remoteDebugPort), "tcp:".concat(remoteDebugPort)]);
              processAdbReverseRemoteDEbug.stderr.on('data', function (data) {
                logger.error(data.toString());
              });
            }
          } catch (error) {
            logger.text("".concat(logSymbols.info, " ").concat(chalk.red("Can not start remote debug server")));
          }

        case 48:
          spinner.stop();
          _context.next = 51;
          return regeneratorRuntime.awrap(new Promise(function () {
            var previewOnZaloURL = "https://zalo.me/app/link/zapps/".concat(appId, "/?env=TESTING_LOCAL&clientIp=").concat(isIOS ? 'http' : 'https', "://").concat(host, ":").concat(app.config.server.port);

            if (previewOnZalo) {
              qrcode.generate(previewOnZaloURL, {
                small: true
              }, function (qrcode) {
                logger.text(chalk.green("".concat(logSymbols.info, " ").concat(chalk.bold("Zalo Mini App dev server is running at: ".concat(host, ":").concat(app.config.server.port)))));
                logger.text(chalk.green("".concat(logSymbols.info, " ").concat(chalk.bold("Trying reverse socket connection"))));

                if (isIOS) {
                  var qrCode = "".concat(logSymbols.info, " ").concat(chalk.bold("Scan the QR code with Zalo app:\n".concat(qrcode)));
                  logger.text(qrCode);
                } else {
                  var processAdbReverse = require('child_process').spawn("adb", ['reverse', "tcp:".concat(app.config.server.port), "tcp:".concat(app.config.server.port)]);

                  processAdbReverse.stderr.on('data', function (data) {
                    logger.error(data.toString());
                  });
                  processAdbReverse.on('exit', function (code) {
                    if (code !== 0) {
                      throw new Error("adb reverse error: ".concat(code));
                    } else {
                      var _qrCode = "".concat(logSymbols.info, " ").concat(chalk.bold("Scan the QR code with Zalo app:\n".concat(qrcode)));

                      logger.text(_qrCode);

                      var processAdbDevices = require('child_process').spawn("adb", ['devices']);

                      processAdbDevices.stdout.on('data', function (data) {
                        logger.text("".concat(chalk.yellow(data.toString())));
                      });
                    }
                  });
                }
              });
            }
          }));

        case 51:
          return _context.abrupt("return", _context.sent);

        case 54:
          _context.prev = 54;
          _context.t0 = _context["catch"](15);
          logger.statusError('Error starting project'); // if (err) logger.error(err.stderr || err);

          logger.error(_context.t0);
          errorExit(_context.t0);
          return _context.abrupt("return");

        case 60:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[15, 54]]);
};