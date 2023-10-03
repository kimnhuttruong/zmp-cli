const generateIndex = require('../templates/v2/generate-index.react');
const fse = require('../../utils/fs-extra');
const path = require('path');
const exec = require('exec-sh');
const updateIcon = require('../icons/update-icon-v3');

async function fromV1ToV2(options) {
  const indexContent = generateIndex(options);
  fse.writeFileSync(path.join(options.cwd, 'index.html'), indexContent);
  fse.copyFileAsync(
    path.resolve(__dirname, '../templates/v2/vite.config.js'),
    path.resolve(options.cwd, 'vite.config.js')
  );
  await exec.promise(
    `npm install vite @vitejs/plugin-react-refresh --save-dev`,
    true
  );
}

async function migrateReact(options) {
  switch (options.migrateVersion) {
    case 'v1tov2':
      await fromV1ToV2(options);
      break;
    case 'iconsv3':
      await updateIcon(options);
      break;
    default:
      break;
  }
}

module.exports = migrateReact;
