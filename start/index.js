#!/usr/bin/env node
/* eslint no-console: off */
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const qrcode = require('qrcode-terminal');
const logSymbols = require('log-symbols');
const { createServer } = require('vite');
const chii = require('chii');

const config = require('../config');
const envUtils = require('../utils/env');
const fs = require('../utils/fs-extra');
const fse = require('../utils/fs-extra');

const spinner = ora('Starting mini app...');

module.exports = async (options = {}, logger, { exitOnError = true } = {}) => {
  function errorExit(err) {
    logger.error(err.stderr || err);
    if (exitOnError) process.exit(1);
  }
  if (!logger) {
    // eslint-disable-next-line
    logger = {
      statusStart() {},
      statusDone() {},
      statusError() {},
      text() {},
      error() {},
    };
  }
  spinner.start();
  const cwd = options.cwd || process.cwd();
  const appId = options.appId || envUtils.getEnv(config.env.appId);
  const previewOnZalo = options.previewOnZalo;
  const isIOS = options.ios;
  const iosHostName = options.iosHostName;
  const usingFrame = options.frame;
  const host = isIOS ? iosHostName : 'localhost';
  const port = options.port;
  const remoteDebugPort = port - 2;
  const mode = options.mode || (previewOnZalo ? 'production' : 'development');
  try {
    if (previewOnZalo) {
      const hrConfigPath = path.join(cwd, 'hr.config.json');
      const remoteDebugScript = {
        id: 'remote-debug-script',
        innerHTML: `(function () { var script = document.createElement('script'); script.src='http://${host}:${remoteDebugPort}/target.js'; document.body.appendChild(script); })()`,
        type: 'text/javascript',
      };
      if (!fs.existsSync(hrConfigPath)) {
        const hrConfig = {
          listCSS: [],
          listJS: [
            {
              src: '/src/app.js',
              type: 'module',
              async: true,
            },
            remoteDebugScript,
          ],
        };
        fs.writeFileSync(hrConfigPath, JSON.stringify(hrConfig, undefined, 4));
      } else {
        const fileData = fs.readFileSync(hrConfigPath);
        const hrConfig = JSON.parse(fileData);

        let listJS = hrConfig.listJS;
        if (!Array.isArray(listJS)) {
          listJS = [];
        }
        const remoteDebugScriptIndex = listJS.findIndex(
          (js) => js.id === 'remote-debug-script'
        );

        if (remoteDebugScriptIndex <= 0) {
          listJS.push(remoteDebugScript);
        } else {
          listJS.splice(remoteDebugScriptIndex, 1);
          listJS.push(remoteDebugScript);
        }
        hrConfig.listJS = listJS;
        fs.writeFileSync(hrConfigPath, JSON.stringify(hrConfig, undefined, 4));
      }
    }
    const localServer = {};

    const publicServer = {
      host: '0.0.0.0',
      hmr: {
        host: host,
        protocol: 'ws',
      },
    };

    let viteConfig = 'vite.config.js';
    const isTypeScriptProject = fse.existsSync(
      path.join(cwd, 'vite.config.ts')
    );
    if (isTypeScriptProject) {
      viteConfig = 'vite.config.ts';
    }

    const server = await createServer({
      configFile: path.join(cwd, viteConfig),
      root: cwd,
      mode,
      define: {
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.previewOnZalo': previewOnZalo,
      },
      server: {
        port: usingFrame ? port - 1 : port,
        ...(previewOnZalo ? publicServer : localServer),
      },
    });
    const app = await server.listen();

    if (!previewOnZalo) {
      if (usingFrame) {
        //run frame server
        const serverFrame = await createServer({
          // any valid user config options, plus `mode` and `configFile`
          configFile: false,
          root: __dirname + '/frame',
          server: {
            port: app.httpServer.address().port + 1,
            strictPort: true,
            open: true,
          },
        });
        spinner.stop();
        await serverFrame.listen();
        const info = serverFrame.config.logger.info;
        info(chalk.green(`Zalo Mini App dev server is running at:\n`));
        serverFrame.printUrls();
      } else {
        spinner.stop();
        const info = server.config.logger.info;
        info(chalk.green(`Zalo Mini App dev server is running at:\n`));
        server.printUrls();
      }
    } else {
      try {
        chii.start({
          port: remoteDebugPort,
        });
        logger.text(
          chalk.green(
            `${logSymbols.info} ${chalk.bold(
              `Remote debugging tool is running at: http://localhost:${remoteDebugPort}`
            )}`
          )
        );
        if (!isIOS) {
          const processAdbReverseRemoteDEbug = require('child_process').spawn(
            `adb`,
            ['reverse', `tcp:${remoteDebugPort}`, `tcp:${remoteDebugPort}`]
          );

          processAdbReverseRemoteDEbug.stderr.on('data', function (data) {
            logger.error(data.toString());
          });
        }
      } catch (error) {
        logger.text(
          `${logSymbols.info} ${chalk.red(`Can not start remote debug server`)}`
        );
      }
    }

    spinner.stop();
    return await new Promise(() => {
      const previewOnZaloURL = `https://zalo.me/app/link/zapps/${appId}/?env=TESTING_LOCAL&clientIp=http://${host}:${app.config.server.port}`;

      if (previewOnZalo) {
        qrcode.generate(previewOnZaloURL, { small: true }, function (qrcode) {
          logger.text(
            chalk.green(
              `${logSymbols.info} ${chalk.bold(
                `Zalo Mini App dev server is running at: ${host}:${app.config.server.port}`
              )}`
            )
          );
          logger.text(
            chalk.green(
              `${logSymbols.info} ${chalk.bold(
                `Trying reverse socket connection`
              )}`
            )
          );
          if (isIOS) {
            const qrCode = `${logSymbols.info} ${chalk.bold(
              `Scan the QR code with Zalo app:\n${qrcode}`
            )}`;
            logger.text(qrCode);
          } else {
            const processAdbReverse = require('child_process').spawn(`adb`, [
              'reverse',
              `tcp:${app.config.server.port}`,
              `tcp:${app.config.server.port}`,
            ]);

            processAdbReverse.stderr.on('data', function (data) {
              logger.error(data.toString());
            });

            processAdbReverse.on('exit', function (code) {
              if (code !== 0) {
                throw new Error(`adb reverse error: ${code}`);
              } else {
                const qrCode = `${logSymbols.info} ${chalk.bold(
                  `Scan the QR code with Zalo app:\n${qrcode}`
                )}`;
                logger.text(qrCode);
                const processAdbDevices = require('child_process').spawn(
                  `adb`,
                  ['devices']
                );

                processAdbDevices.stdout.on('data', function (data) {
                  logger.text(`${chalk.yellow(data.toString())}`);
                });
              }
            });
          }
        });
      }
    });
  } catch (err) {
    logger.statusError('Error starting project');
    // if (err) logger.error(err.stderr || err);
    logger.error(err);
    errorExit(err);
    return;
  }
};
