const fse = require('../../utils/fs-extra');
const path = require('path');
const exec = require('exec-sh');

async function updateIcon(options) {
  if (options.uiFramework === 'zmp-framework') {
    fse.copyFileAsync(
      path.resolve(__dirname, './icons.css'),
      path.resolve(options.cwd, './src/css/icons.css')
    );
    await exec.promise(`npm install zmp-framework@latest`, true);
  } else if (options.uiFramework === 'zmp-ui') {
    await exec.promise(`npm install zmp-ui@latest`, true);
  } else {
    return;
  }
}

module.exports = updateIcon;
