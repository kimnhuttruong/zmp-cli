const logSymbols = require('log-symbols');
const axios = require('axios');
const pkg = require('../package.json');
const spinner = require('./spinner');
const log = require('./log');

async function checkUpdate() {
  spinner.start('Checking for available updates...');

  const hasUpdate = await new Promise((resolve, reject) => {
    axios
      .get('https://registry.npmjs.org/zmp-cli/latest')
      .then((res) => {
        const latestVersion = res.data.version
          .split('.')
          .map((n) => parseInt(n, 10));
        const currentVersion = pkg.version
          .split('.')
          .map((n) => parseInt(n, 10));
        let hasUpdateVersion = false;
        let currentIsHigher = false;
        latestVersion.forEach((n, index) => {
          if (currentIsHigher) return;
          if (latestVersion[index] > currentVersion[index])
            hasUpdateVersion = true;
          else if (latestVersion[index] < currentVersion[index])
            currentIsHigher = true;
        });
        resolve(hasUpdateVersion);
      })
      .catch((err) => {
        reject(err);
        spinner.error('Error checking update');
        if (err) log.error(err.stderr || err);
        process.exit(1);
      });
  });

  if (hasUpdate) {
    spinner.error('Update available');
    log.text(
      `\n${logSymbols.warning} Please update zmp-cli to latest version before continue.`,
      true
    );
    log.text(`${logSymbols.warning} To update zmp-cli, run in terminal:`, true);
    log.text('\nnpm install zmp-cli -g\n', true);
    process.exit(1);
  } else {
    spinner.done('All good, you have latest zmp-cli version.');
  }
}

module.exports = checkUpdate;
