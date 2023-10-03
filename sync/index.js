const path = require('path');
const chalk = require('chalk');
const fse = require('../utils/fs-extra');
const config = require('../config');
const { generateListResourcesFromIndex } = require('./index-to-app-config');

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

module.exports = async (options = {}, logger = defaultLogger) => {
  logger.statusStart(`Synchronization configuration ${waitText}`);
  const cwd = process.cwd();
  const { source, rootElement } = options;
  const appConfigFilename = config.filename.appConfig;
  const resolvePath = (dir) => {
    return path.join(cwd, dir);
  };
  function errorExit(err) {
    logger.error(err.stderr || err);
    process.exit(1);
  }
  let appConfigJson;
  try {
    appConfigJson = require(resolvePath(appConfigFilename));
  } catch (err) {
    errorExit(new Error(config.error_msg.app_config_not_found));
  }

  const html = fse.readFileSync(source).toString();
  const outputDir = path.dirname(source);
  const { listCSS, listSyncJS, listAsyncJS, inlineJS } =
    await generateListResourcesFromIndex(html, { outputDir, rootElement });
  Object.assign(appConfigJson, {
    listCSS,
    listSyncJS,
    listAsyncJS,
  });
  if (inlineJS) {
    fse.writeFileSync(resolvePath(`${outputDir}/inline.js`), inlineJS);
  }
  const output = JSON.stringify(appConfigJson, null, 2);
  fse.writeFileSync(resolvePath(appConfigFilename), output);
  logger.statusDone(
    `${chalk.bold.green('Configuration synchronization completed!')} 💪`
  );
  logger.text({ listCSS, listSyncJS, listAsyncJS });
};
