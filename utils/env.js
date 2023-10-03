const fse = require('./fs-extra');
const config = require('../config');

const { parse, stringify } = require('envfile');

/**
 * Function to get value from env
 * @param {string} key
 *
 */
function getEnv(key) {
  const value = process.env[key];
  if (value) return value;
  const rootENV = config.root_env();
  const exists = fse.existsSync(rootENV);
  if (!exists) return undefined;
  const data = fse.readFileSync(rootENV, 'utf8');
  const result = parse(data);
  return result[key];
}

/**
 * Function to set environment variables.
 * @param {string} key
 * @param {string} value
 *
 */
function setEnv(key, value) {
  const rootENV = config.root_env();
  const data = fse.readFileSync(rootENV, 'utf8');
  let result = parse(data);
  result[key] = value;
  fse.writeFileSync(rootENV, stringify(result));
}

module.exports = {
  getEnv,
  setEnv,
};
