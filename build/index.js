#!/usr/bin/env node
/* eslint no-console: off */
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const { build } = require('vite');
const dynamicImportVars = require('@rollup/plugin-dynamic-import-vars').default;
const _ = require('lodash');
const replace = require('@rollup/plugin-replace');
const log = require('../utils/log');
const fse = require('../utils/fs-extra');
const getAppInfo = require('../utils/get-app-info');
const envUtils = require('../utils/env');
const config = require('../config');
const generatePagesMap = require('../utils/generate-pages-map');

const env = envUtils.getEnv('NODE_ENV') || 'production';

const waitText = chalk.gray('Building... (Please wait, it can take a while)');
const frameworkWarning = chalk.yellow(
  'Warning: This CLI version will work better with zmp-framework version 1.5.0 or higher'
);
const spinner = ora(
  env === 'production'
    ? 'Building for production...'
    : 'Building development version...'
);

module.exports = async (options = {}, logger, { exitOnError = true } = {}) => {
  const cwd = options.cwd || process.cwd();
  const resolvePath = (dir) => {
    return path.join(cwd, dir);
  };
  const appConfig =
    options.appConfigJson || require(resolvePath(config.filename.appConfig));
  function errorExit(err) {
    log.error(err.stderr || err);
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
  logger.text(frameworkWarning);
  spinner.start();
  logger.statusStart(waitText);
  try {
    const appId = envUtils.getEnv(config.env.appId);
    let nextVersion = options.nextVersion;
    if (!nextVersion) {
      const appInfo = await getAppInfo(appId, options);
      let currentVersion =
        appInfo && appInfo.latestVersion && Number(appInfo.latestVersion);
      if (currentVersion === undefined || currentVersion === null) {
        currentVersion = 0;
      }
      nextVersion = currentVersion + 1;
    }

    let viteConfig = 'vite.config.js';
    const isTypeScriptProject = fse.existsSync(
      path.join(cwd, 'vite.config.ts')
    );
    if (isTypeScriptProject) {
      viteConfig = 'vite.config.ts';
    }
    // eslint-disable-next-line
    const res = await build({
      configFile: path.join(cwd, viteConfig),
      root: cwd,
      base: `${config.zdn_url}${appId}/${nextVersion}/`,
      css: {
        modules: {
          scopeBehaviour: 'local',
        },
      },
      mode: options.mode,
      build: {
        target: 'es2015',
        outDir: path.join(cwd, 'www'),
        assetsInlineLimit: 0,
        cssCodeSplit: false,
        cssTarget: ['es2015', 'safari13.1'],
        rollupOptions: {
          plugins: [
            replace({
              values: {
                ZMP_IMPORT_PAGES: () => generatePagesMap(cwd),
              },
            }),
            dynamicImportVars({
              warnOnError: true,
            }),
          ],
          output: {
            entryFileNames: 'assets/[name].[hash].module.js',
            chunkFileNames: 'assets/[name].[hash].module.js',
          },
        },
      },
      logLevel: 'error',
    });

    const output = res.output.map((obj) =>
      _.pick(obj, [
        'fileName',
        'type',
        'isEntry',
        'isImplicitEntry',
        'isDynamicEntry',
      ])
    );
    const jsFiles = output.filter((file) => {
      if (file.type !== 'chunk') return false;
      return file.isEntry || !file.isDynamicEntry;
    });
    const cssFiles = output.filter((file) => {
      if (file.type !== 'asset' || !file.fileName.endsWith('.css'))
        return false;
      // const name = file.fileName.replace(/\.([a-z0-9]{8})\.css$/, '');
      // if (!jsFiles.find((js) => js.fileName.startsWith(name))) return false;
      return true;
    });
    const appConfigJson = {
      ...appConfig,
      listCSS: [
        ...(Array.isArray(appConfig.listCSS) ? appConfig.listCSS : []),
        ...cssFiles.map((f) => f.fileName),
      ],
      listSyncJS: [
        ...(Array.isArray(appConfig.listSyncJS) ? appConfig.listSyncJS : []),
        ...jsFiles.map((f) => f.fileName),
      ],
      listAsyncJS: [
        ...(Array.isArray(appConfig.listAsyncJS) ? appConfig.listAsyncJS : []),
      ],
    };
    fse.writeFileSync(
      resolvePath(`www/${config.filename.appConfig}`),
      JSON.stringify(appConfigJson)
    );
    logger.statusDone(`${chalk.bold.green('Build Done!\n')}`);
    return appConfigJson;
  } catch (err) {
    logger.statusError('Error building project');
    // if (err) logger.error(err.stderr || err);
    errorExit(err);
    return;
  }
};
