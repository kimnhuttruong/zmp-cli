#!/usr/bin/env node

/* eslint no-console: off */
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var chalk = require('chalk');

var clear = require('clear');

var figlet = require('figlet');

var program = require('commander');

var logSymbols = require('log-symbols');

var fse = require('./utils/fs-extra');

var checkUpdate = require('./utils/check-update');

var spinner = require('./utils/spinner');

var log = require('./utils/log');

var getCurrentProject = require('./utils/get-current-project');

var getOptions = require('./create/utils/get-options');

var getLoginOptions = require('./login/utils/get-options');

var getDeployOptions = require('./deploy/utils/get-options');

var getMigrateOptions = require('./migrate/utils/get-options');

var loginApp = require('./login/index');

var createApp = require('./create/index');

var startApp = require('./start/index');

var buildApp = require('./build/index');

var deployApp = require('./deploy/index');

var migrateApp = require('./migrate/index');

var os = require('os'); // const generateAssets = require('./assets/index');
// const server = require('./ui/server');


var pkg = require('./package.json');

var config = require('./config');

var cwd = process.cwd();
var logger = {
  statusStart: function statusStart(text) {
    return spinner.start(text);
  },
  statusDone: function statusDone(text) {
    return spinner.done(text);
  },
  statusText: function statusText(text) {
    return spinner.text(text);
  },
  statusError: function statusError(text) {
    return spinner.error(text);
  },
  text: function text(_text) {
    return log.text(_text);
  },
  error: function error(text) {
    return log.error(text);
  },
  showOnUI: function showOnUI() {}
};
/* =============================================
Header
============================================= */

clear();

if (!fse.existsSync(config.root_env())) {
  fse.writeFileSync(config.root_env());
}

console.log(chalk.cyan(figlet.textSync('ZMP CLI', {
  horizontalLayout: 'full',
  verticalLayout: 'full'
})), chalk.cyan("Version: ".concat(pkg.version, "\n")));
/* =============================================
Commands
============================================= */

program.version(pkg.version).usage('<command> [options]').command('init').option('--skipUpdate', 'Skip checking for update of zmp-cli').description('Init ZMP project').action(function _callee(options) {
  var currentProject, optsLogin, opts;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (options.skipUpdate) {
            _context.next = 3;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(checkUpdate());

        case 3:
          currentProject = getCurrentProject(cwd);

          if (currentProject) {
            log.text("".concat(logSymbols.error, " ZMP project already set up in current directory"));
            process.exit(1);
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(getLoginOptions());

        case 7:
          optsLogin = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(loginApp(_objectSpread({
            cwd: cwd
          }, optsLogin), logger));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(getOptions());

        case 12:
          opts = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(createApp(_objectSpread({
            cwd: cwd
          }, opts), logger));

        case 15:
          process.exit(0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
});
program.usage('<command> [options]').command('login').description('Login ZMP').action(function _callee2() {
  var optsLogin;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getLoginOptions());

        case 2:
          optsLogin = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(loginApp(_objectSpread({
            cwd: cwd
          }, optsLogin), logger));

        case 5:
          process.exit(0);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
program.usage('<command> [options]').command('start').option('-iosH, --ios-host-name <n>', 'Specify server hostname. By default it is os.hostname').option('-P, --port <n>', 'Specify server port. By default it is 3000', parseInt).option('-Z, --zalo-app', 'Preview on Zalo').option('-ios, --ios', 'Run on ios').option('-nF, --no-frame', 'Run without Zalo frame').option('-D, --dev', 'Development environment').description('Start a ZMP project').action(function _callee3(options) {
  var currentProject;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          currentProject = getCurrentProject(cwd);

          if (!currentProject) {
            log.text("".concat(logSymbols.error, " This is not ZMP project"));
            process.exit(1);
          }

          if (options && options.showMobileUi) {
            try {
              console.log(require.resolve('nw'));
            } catch (e) {
              console.error('NW.js module is not found. Please run "npm install -g nw@sdk"');
              process.exit(e.code);
            }
          }

          _context3.next = 5;
          return regeneratorRuntime.awrap(startApp({
            cwd: cwd,
            port: options && options.port || 3000,
            iosHostName: options && options.iosHostName || os.hostname(),
            showMobileUI: options && options.showMobileUi || false,
            previewOnZalo: options && options.zaloApp || false,
            ios: options && options.ios || false,
            frame: options && (typeof options.frame === 'undefined' || options.frame === null) ? true : options.frame
          }, logger));

        case 5:
          process.exit(0);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
program.usage('<command> [options]').command('build').description('Build a ZMP project').action(function _callee4() {
  var currentProject;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          currentProject = getCurrentProject(cwd);

          if (!currentProject) {
            log.text("".concat(logSymbols.error, " This is not ZMP project"));
            process.exit(1);
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(buildApp({
            cwd: cwd
          }, logger));

        case 4:
          process.exit(0);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
});
program.usage('<command> [options]').command('deploy').option('-D, --dev', 'Deploy in Development server').option('-P, --port <n>', 'Specify UI server port. By default it is 3001', parseInt).description('Deploy a ZMP project').action(function _callee5(options) {
  var currentProject, opts;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          currentProject = getCurrentProject(cwd);
          _context5.next = 3;
          return regeneratorRuntime.awrap(getDeployOptions(currentProject));

        case 3:
          opts = _context5.sent;
          if (opts.quit) process.exit(1);
          _context5.next = 7;
          return regeneratorRuntime.awrap(deployApp(_objectSpread({
            cwd: cwd,
            dev: options && options.dev
          }, opts), logger));

        case 7:
          process.exit(0);

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
});
program.usage('<command> [options]').command('migrate').action(function _callee6() {
  var currentProject, opts;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          currentProject = getCurrentProject(cwd);

          if (!currentProject) {
            logger.text("".concat(logSymbols.error, " This is not ZMP project"));
            process.exit(1);
          }

          _context6.next = 4;
          return regeneratorRuntime.awrap(getMigrateOptions());

        case 4:
          opts = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(migrateApp(_objectSpread({
            cwd: cwd
          }, opts, {}, currentProject), logger));

        case 7:
          process.exit(0);

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // program
//   .command('assets')
//   .alias('generate-assets')
//   .option('--skipUpdate', 'Skip checking for update of zmp-cli')
//   .option('--ui', 'Launch assets generation UI')
//   .option(
//     '-P, --port <n>',
//     'Specify UI server port. By default it is 3001',
//     parseInt
//   )
//   .description('Generate ZMP app icons and splash screens')
//   .action(async (options) => {
//     // Check update
//     if (options.skipUpdate === undefined) {
//       await checkUpdate();
//     }
//     const currentProject = getCurrentProject(cwd);
//     if (!currentProject) {
//       log.text(
//         `${logSymbols.error} ZMP project not found in current directory`
//       );
//       process.exit(1);
//     }
//     if (options.ui) {
//       spinner.start('Launching ZMP UI server');
//       server('/assets/', options.port);
//       spinner.end('Launching ZMP UI server');
//     } else {
//       await generateAssets({}, currentProject, logger);
//       process.exit(0);
//     }
//   });

program.on('command:*', function (cmd) {
  program.outputHelp();
  log.text("\n Unknown command ".concat(cmd));
});
program.parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
}