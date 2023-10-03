const path = require('path');
const fse = require('../../utils/fs-extra');

module.exports = (options) => {
  const cwd = options.cwd || process.cwd();
  const { framework } = options;

  const srcFolder = 'src';

  const folders = [
    `./${srcFolder}`,
    `./${srcFolder}/static`,
    `./${srcFolder}/css`,
    `./${srcFolder}/pages`,
    `./public`,
    './assets-src',
  ];
  if (folders.indexOf('./www') < 0) {
    folders.push('./www');
  }
  if (framework !== 'core') {
    folders.push(...[`./${srcFolder}/components`]);
  }

  folders.push(`./${srcFolder}/static/icons`);

  folders.forEach((f) => {
    fse.mkdirSync(path.resolve(cwd, f));
  });
};
