#!/usr/bin/env node
/* eslint no-console: off */
const exec = require('exec-sh');
const path = require('path');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const fse = require('../utils/fs-extra');
const generatePackageJson = require('./utils/generate-package-json');
const generateNpmScripts = require('./utils/generate-npm-scripts');

const generateAppConfig = require('./utils/generate-app-config');

const createFolders = require('./templates/create-folders');
const copyAssets = require('./templates/copy-assets');
const generateReadme = require('./utils/generate-readme');
const generateGitignore = require('./utils/generate-gitignore');
const log = require('../utils/log');
const config = require('../config');

const waitText = chalk.gray('(Please wait, it can take a while)');

module.exports = async (
  options = {},
  logger,
  { exitOnError = true, iconFile = null } = {}
) => {
  const cwd = options.cwd || process.cwd();
  const isRunningInCwd = cwd === process.cwd();
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
  // App config
  logger.statusStart('Generating app-config.json');
  const appConfig = generateAppConfig(options);

  fse.writeFileSync(
    path.join(cwd, config.filename.appConfig),
    appConfig.content
  );
  logger.statusDone('Generating app-config.json');

  if (!options.newProject) {
    const deployScripts = generateNpmScripts(['r']).map((s) => {
      return `${s.icon} Run "npm run ${s.name}" - ${s.description}`;
    });
    logger.text(deployScripts.join('\n'));
    process.exit(0);
  }

  // Package
  logger.statusStart('Generating package.json');
  const packageJson = generatePackageJson(options);
  fse.writeFileSync(path.join(cwd, 'package.json'), packageJson.content);
  fse.writeFileSync(
    path.join(cwd, config.filename.zmpConfig),
    JSON.stringify(options, '', 2)
  );

  logger.statusDone('Generating package.json');

  // Create Folders
  logger.statusStart('Creating required folders structure');
  try {
    createFolders(options);
  } catch (err) {
    logger.statusError('Error creating required folders structure');
    // if (err) logger.error(err.stderr);
    errorExit(err);
  }
  logger.statusDone('Creating required folders structure');

  // Install NPM depenencies
  logger.statusStart(`${'Installing NPM Dependencies'} ${waitText}`);
  try {
    if (!isRunningInCwd) {
      await exec.promise(
        `cd ${cwd.replace(
          / /g,
          '\\ '
        )} && npm install ${packageJson.dependencies.join(' ')} --save`,
        true
      );
    } else {
      await exec.promise(
        `npm install ${packageJson.dependencies.join(' ')} --save`,
        true
      );
    }
  } catch (err) {
    logger.statusError('Error installing NPM Dependencies');
    // if (err) logger.error(err.stderr);
    errorExit(err);
    return;
  }
  logger.statusDone('Installing NPM Dependencies');
  // Install NPM dev depenencies
  logger.statusStart(`${'Installing NPM Dev Dependencies'} ${waitText}`);
  try {
    if (!isRunningInCwd) {
      await exec.promise(
        `cd ${cwd.replace(
          / /g,
          '\\ '
        )} && npm install ${packageJson.devDependencies.join(' ')} --save-dev`,
        true
      );
    } else {
      await exec.promise(
        `npm install ${packageJson.devDependencies.join(' ')} --save-dev`,
        true
      );
    }
  } catch (err) {
    logger.statusError('Error installing NPM Dev Dependencies');
    // if (err) logger.error(err.stderr);
    errorExit(err);
    return;
  }
  logger.statusDone('Installing NPM Dev Dependencies');

  if (packageJson.postInstall && packageJson.postInstall.length) {
    logger.statusStart('Executing NPM Scripts');
    try {
      if (!isRunningInCwd) {
        await exec.promise(
          `cd ${cwd.replace(/ /g, '\\ ')} && npm run postinstall`,
          true
        );
      } else {
        await exec.promise('npm run postinstall', true);
      }
    } catch (err) {
      logger.statusError('Error executing NPM Scripts');
      // if (err) logger.error(err.stderr);
      errorExit(err);
      return;
    }
    logger.statusDone('Executing NPM Scripts');
  }

  // Create Project Files
  logger.statusStart('Creating project files');
  const filesToCopy = copyAssets(options, iconFile);
  try {
    // eslint-disable-next-line
    await Promise.all(
      filesToCopy.map((f) => {
        if (f.from) {
          return fse.copyFileAsync(f.from, f.to);
        }
        if (f.content) {
          return fse.writeFileAsync(f.to, f.content);
        }
        return Promise.resolve();
      })
    );
  } catch (err) {
    logger.statusError('Error creating project files');
    // if (err) logger.error(err.stderr || err);
    errorExit(err);
    return;
  }

  // Generate Readme
  const readMeContent = generateReadme(options);
  try {
    fse.writeFileSync(path.join(cwd, 'README.md'), readMeContent);
  } catch (err) {
    logger.statusError('Error creating project files');
    // if (err) logger.error(err.stderr || err);
    errorExit(err);
    return;
  }

  // Generate .gitignore
  const gitignoreContent = generateGitignore(options);
  try {
    fse.writeFileSync(path.join(cwd, '.gitignore'), gitignoreContent);
  } catch (err) {
    logger.statusError('Error creating project files');
    // if (err) logger.error(err.stderr || err);
    errorExit(err);
    return;
  }

  logger.statusDone('Creating project files');

  let npmScripts = generateNpmScripts(['s', 'r']).map((s) => {
    return `- ${s.icon} Run "npm run ${s.name}" - ${s.description}`;
  });

  // Final Text
  const finalText = `
${chalk.bold(logSymbols.success)} ${chalk.bold('Done!')} 💪

${chalk.bold(logSymbols.info)} ${chalk.bold('Next steps:')}
  ${npmScripts.join('\n  ')}
  - 📖 Visit documentation at ${chalk.bold('https://mini.zalo.me/')}
  - 📖 Check ${chalk.bold(
    'README.md'
  )} in project root folder with further instructions
    `;

  logger.text(finalText);
};
