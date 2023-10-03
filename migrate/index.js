#!/usr/bin/env node
/* eslint no-console: off */

const chalk = require('chalk');
const log = require('../utils/log');
const path = require('path');
const envUtils = require('../utils/env');
const logSymbols = require('log-symbols');

const migrateReact = require('./utils/migrate-react');
const config = require('../config');

const waitText = chalk.gray('(Please wait, it can take a while)');

async function migrateApp(
  options = {},
  logger,
  { exitOnError = true, iconFile = null } = {}
) {
  const cwd = options.cwd || process.cwd();
  const resolvePath = (dir) => {
    return path.join(cwd, dir);
  };
  function errorExit(err) {
    log.error(err.stderr || err);
    if (exitOnError) process.exit(1);
  }
  if (!logger) {
    // eslint-disable-next-line
    logger = {
      statusStart() {},
      statusDone() {},
      statusText() {},
      statusError() {},
      text() {},
      error() {},
      showOnUI() {},
    };
  }
  logger.statusStart(`Migrating Your App ${waitText}`);
  try {
    const zmpConfig = require(resolvePath(config.filename.zmpConfig));
    switch (zmpConfig.framework) {
      case 'react':
        await migrateReact(options);
        break;
      default:
        logger.text(
          `${logSymbols.error} Project using ZMP ${zmpConfig.framework} is not yet supported`
        );
        process.exit(1);
    }
    logger.statusDone(`${chalk.bold.green('Migration Done!')} 💪`);
  } catch (err) {
    logger.statusError('Migration error!');
    errorExit(err);
  }
}

module.exports = migrateApp;
