#!/usr/bin/env node
/* eslint no-console: off */
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');
const logSymbols = require('log-symbols');
const fse = require('./utils/fs-extra');
const checkUpdate = require('./utils/check-update');
const spinner = require('./utils/spinner');
const log = require('./utils/log');
const getCurrentProject = require('./utils/get-current-project');
const getOptions = require('./create/utils/get-options');
const getLoginOptions = require('./login/utils/get-options');
const getDeployOptions = require('./deploy/utils/get-options');
const getMigrateOptions = require('./migrate/utils/get-options');
const loginApp = require('./login/index');
const createApp = require('./create/index');
const startApp = require('./start/index');
const buildApp = require('./build/index');
const deployApp = require('./deploy/index');
const syncApp = require('./sync/index');
const migrateApp = require('./migrate/index');
const os = require('os');
// const generateAssets = require('./assets/index');
// const server = require('./ui/server');
const pkg = require('./package.json');
const config = require('./config');
const { versionStatus } = require('./utils/constants');

const cwd = process.cwd();

const logger = {
  statusStart: (text) => spinner.start(text),
  statusDone: (text) => spinner.done(text),
  statusText: (text) => spinner.text(text),
  statusError: (text) => spinner.error(text),
  text: (text) => log.text(text),
  error: (text) => log.error(text),
  showOnUI: () => {},
};
const { execSync } = require('child_process');
/* =============================================
Header
============================================= */

clear();
if (!fse.existsSync(config.root_env())) {
  fse.writeFileSync(config.root_env());
}

console.log(
  chalk.cyan(
    figlet.textSync('ZMP CLI', {
      horizontalLayout: 'full',
      verticalLayout: 'full',
    })
  ),
  chalk.cyan(`Version: ${pkg.version}\n`)
);
/* =============================================
Commands
============================================= */
program
  .version(pkg.version)
  .usage('<command> [options]')
  .command('init')
  .option('--skipUpdate', 'Skip checking for update of zmp-cli')
  .description('Init ZMP project')
  .action(async (options) => {
    if (!options.skipUpdate) await checkUpdate();

    const currentProject = getCurrentProject(cwd);
    if (currentProject) {
      log.text(
        `${logSymbols.error} ZMP project already set up in current directory`
      );
      process.exit(1);
    }
    const optsLogin = await getLoginOptions();
    await loginApp({ cwd, ...optsLogin }, logger);
    const opts = await getOptions();
    await createApp({ cwd, ...opts }, logger);
    process.exit(0);
  });

program
  .usage('<command> [options]')
  .command('login')
  .description('Login ZMP')
  .action(async () => {
    const currentProject = getCurrentProject(cwd);
    // if (!currentProject) {
    //   log.text(`${logSymbols.error} This is not ZMP project`);
    //   process.exit(1);
    // }

    const optsLogin = await getLoginOptions();
    await loginApp(
      {
        cwd,
        ...optsLogin,
      },
      logger
    );
    process.exit(0);
  });

program
  .usage('<command> [options]')
  .command('start')
  .option(
    '-iosH, --ios-host-name <n>',
    'Specify server hostname. By default it is os.hostname'
  )
  .option(
    '-P, --port <n>',
    'Specify server port. By default it is 3000',
    parseInt
  )
  .option('-Z, --zalo-app', 'Preview on Zalo')
  .option('-ios, --ios', 'Run on ios')
  .option('-nF, --no-frame', 'Run without Zalo frame')
  .option('-D, --dev', 'Development environment')
  .option('-M, --mode <m>', 'Env mode')
  .description('Start a ZMP project')
  .action(async (options) => {
    const currentProject = getCurrentProject(cwd);

    if (!currentProject) {
      log.text(`${logSymbols.error} This is not ZMP project`);
      process.exit(1);
    }

    if (options && options.showMobileUi) {
      try {
        console.log(require.resolve('nw'));
      } catch (e) {
        console.error(
          'NW.js module is not found. Please run "npm install -g nw@sdk"'
        );
        process.exit(e.code);
      }
    }

    let defaultIOSHostName = os.hostname();
    if (!defaultIOSHostName.includes('.local')) {
      defaultIOSHostName = `${defaultIOSHostName}.local`;
    }

    await startApp(
      {
        cwd,
        port: (options && options.port) || 3000,
        iosHostName: (options && options.iosHostName) || defaultIOSHostName,
        showMobileUI: (options && options.showMobileUi) || false,
        previewOnZalo: (options && options.zaloApp) || false,
        ios: (options && options.ios) || false,
        mode: options && options.mode,
        frame:
          options &&
          (typeof options.frame === 'undefined' || options.frame === null)
            ? true
            : options.frame,
      },
      logger
    );
    process.exit(0);
  });

program
  .usage('<command> [options]')
  .command('build')
  .description('Build a ZMP project')
  .action(async () => {
    const currentProject = getCurrentProject(cwd);

    if (!currentProject) {
      log.text(`${logSymbols.error} This is not ZMP project`);
      process.exit(1);
    }

    await buildApp(
      {
        cwd,
      },
      logger
    );
    process.exit(0);
  });

program
  .usage('<command> [options]')
  .command('deploy')
  .option('-D, --dev', 'Deploy in Development server')
  .option('-M, --mode <m>', 'Env mode')
  .option('-p, --passive', 'Passive mode (non-interactive)')
  .option('-e, --existing', 'Deploy existing project')
  .option('-t, --testing', 'Deploy testing version')
  .option('-m, --desc <message>', 'Version description')
  .option('-o, --outputDir <output>', 'Output folder. Default www')
  .option(
    '-P, --port <n>',
    'Specify UI server port. By default it is 3001',
    parseInt
  )
  .description('Deploy a ZMP project')
  .action(async (options) => {
    const currentProject = getCurrentProject(cwd);
    let opts = options;
    if (options.existing) {
      opts.customProject = true;
    } else {
      // if (!options.passive) {
      //    opts = await getDeployOptions(currentProject);
      //    console.log(opts);
      // }
      //HardCode
      //versionStatus=0:development,versionStatus=2:testing
      // Lấy commit hash của commit mới nhất
      const commitHash = execSync('git rev-parse HEAD').toString().trim();
      // Lấy mô tả của commit
      const commitDescription = execSync(`git log --format=%B -n 1 ${commitHash}`).toString().trim();
      if (!options.passive) {
        opts = {
          quit: false,
          outputDir: 'www',
          versionStatus: 2,
          desc: commitDescription,
          customProject: true
        }
      }
    }
    if (options.testing) {
      opts.versionStatus = versionStatus.TESTING;
    }
    if (opts.quit) process.exit(1);
    await deployApp(
      {
        cwd,
        dev: options && options.dev,
        mode: options && options.mode,
        ...opts,
      },
      logger
    );
    process.exit(0);
  });

program
  .usage('<command> [options]')
  .command('sync-config <source>')
  .option(
    '-r, --root-element <selector>',
    'Custom entry point, default is #app'
  )
  .description(
    'Automatically update app-config.json resources list based on index.html'
  )
  .action(async (source, options) => {
    await syncApp(
      {
        source,
        ...options,
      },
      logger
    );
    process.exit(0);
  });

program
  .usage('<command> [options]')
  .command('migrate')
  .action(async function () {
    const currentProject = getCurrentProject(cwd);
    if (!currentProject) {
      logger.text(`${logSymbols.error} This is not ZMP project`);
      process.exit(1);
    }
    const opts = await getMigrateOptions();
    await migrateApp(
      {
        cwd,
        ...opts,
        ...currentProject,
      },
      logger
    );
    process.exit(0);
  });

// program
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

program.on('command:*', (cmd) => {
  program.outputHelp();
  log.text(`\n Unknown command ${cmd}`);
});

program.parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
}
