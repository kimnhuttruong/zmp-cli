/* eslint no-param-reassign: ["off"] */
const inquirer = require('inquirer');

const questions = [
  {
    type: 'list',
    name: 'migrateVersion',
    message: 'What version do you want to migrate?',
    choices: [
      {
        name: 'Version 1 => Version 2',
        value: 'v1tov2',
      },
      {
        name: 'Icons (fix icon not displayed in iOS v16+)',
        value: 'iconsv3',
      },
    ],
  },
  {
    type: 'list',
    name: 'uiFramework',
    message: 'Choose which framework or library used in your project',
    when: (otp) => otp.migrateVersion === 'iconsv3',
    choices: [
      {
        name: 'zmp-framework',
        value: 'zmp-framework',
      },
      {
        name: 'zmp-ui',
        value: 'zmp-ui',
      },
      {
        name: 'Other',
        value: 'other',
      },
    ],
  },
];

module.exports = function getOptions() {
  return inquirer.prompt(questions).then((options) => {
    return Promise.resolve(options);
  });
};
