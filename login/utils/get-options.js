/* eslint no-param-reassign: ["off"] */
const inquirer = require('inquirer');
const envUtils = require('../../utils/env');
const config = require('../../config');

module.exports = function getOptions() {
  const questions = [
    {
      type: 'input',
      name: 'appId',
      message: 'Mini App ID:',
      when: () => !envUtils.getEnv(config.env.appId),
      validate(input) {
        return new Promise((resolve, reject) => {
          if (!input) reject(new Error('Mimi App ID is required'));
          else resolve(true);
        });
      },
    },
    {
      type: 'list',
      name: 'loginMethod',
      message: 'Choose a Login Method',
      choices: [
        {
          name: '1. Login Via QR Code With Zalo App',
          value: 'zalo',
        },
        {
          name: '2. Login With App Access Token',
          value: 'accessToken',
        },
      ],
      validate(input) {
        return new Promise((resolve, reject) => {
          if (!input || !input.length)
            reject(new Error('Login method is required!'));
          else resolve(true);
        });
      },
    },
    {
      type: 'input',
      name: 'token',
      message: 'Zalo Access Token:',
      when: (opts) => opts.loginMethod === 'accessToken',
      validate(input) {
        return new Promise((resolve, reject) => {
          if (!input) reject(new Error('Zalo Access Token is required'));
          else resolve(true);
        });
      },
    },
  ];
  return inquirer.prompt(questions).then((options) => {
    return Promise.resolve(options);
  });
};
