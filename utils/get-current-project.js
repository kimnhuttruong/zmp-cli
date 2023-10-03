const config = require('../config');
const path = require('path');

module.exports = (cwd) => {
  let currentProject;
  try {
    // eslint-disable-next-line
    currentProject = require(path.resolve(cwd, config.filename.zmpConfig));
  } catch (err) {
    // all good
  }
  if (!currentProject) {
    try {
      // eslint-disable-next-line
      currentProject = require(path.resolve(cwd, 'package.json')).zmp;
    } catch (err) {
      // all good
    }
  }
  if (!currentProject) return undefined;
  return {
    cwd,
    ...(currentProject || {}),
  };
};
