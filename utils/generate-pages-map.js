const path = require('path');
const normalizePath = require('normalize-path');
const findFilesByExt = require('./find-files-by-ext');

module.exports = (cwd) => {
  const pagesDir = path.resolve(cwd, `src${path.sep}pages`);
  const files = findFilesByExt(pagesDir);
  const objectEntries = files.map(({ fileName, folderPath, ext }) => {
    const fileDir = path
      .join(folderPath, fileName)
      .replace(`${pagesDir}${path.sep}`, '');
    const fileDirNormalized = normalizePath(fileDir);
    const filePath = normalizePath(path.join(folderPath, `${fileName}.${ext}`));
    return `"${fileDirNormalized}" : () => import("${filePath}")`;
  });
  return `{${objectEntries.join(',')}}`;
};
