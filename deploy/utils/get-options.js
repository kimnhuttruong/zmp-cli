/* eslint no-param-reassign: ["off"] */
const inquirer = require('inquirer');
const { versionStatus } = require('../../utils/constants');
const _ = require('lodash');

const questions = [
  {
    type: 'list',
    name: 'versionStatus',
    message: 'What version status are you deploying?',
    choices: Object.keys(versionStatus).map((key) => ({
      name: _.capitalize(key),
      value: versionStatus[key],
    })),
    when: (opts) => !opts.quit,
    validate(input) {
      return new Promise((resolve, reject) => {
        if (!input || !input.length)
          reject(new Error('Server type is required!'));
        else resolve(true);
      });
    },
  },
  {
    type: 'input',
    name: 'desc',
    message: 'Description:',
    when: (opts) => !opts.quit,
    validate(input) {
      return new Promise((resolve, reject) => {
        if (!input || !input.length)
          reject(new Error('Description is required!'));
        else resolve(true);
      });
    },
  },
];

const nonZmpOptions = [
  {
    type: 'list',
    name: 'quit',
    message: 'This is not a ZMP Project, do you want to continue?',
    choices: [
      { name: 'Deploy your existing project', value: false },
      { name: 'Quit', value: true },
    ],
  },
  {
    type: 'input',
    name: 'outputDir',
    message: 'Where is your dist folder?',
    when: (opts) => !opts.quit,
    default: 'www',
  },
];

module.exports = async function getOptions(project = undefined) {
  const promptQuestions = project
    ? [...questions]
    : [...nonZmpOptions, ...questions];
  return inquirer.prompt(promptQuestions).then((options) => {
    options.customProject = false;
    if (options.quit === false) {
      options.customProject = true;
    }
    return Promise.resolve(options);
  });
};
