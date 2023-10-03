"use strict";

/* eslint no-param-reassign: ["off"] */
var inquirer = require('inquirer');

var chalk = require('chalk');

var moreOptionsText = chalk.italic("\t- Including Tailwind CSS\n\t- Including Recoil (React only)");
var questions = [{
  type: 'list',
  name: 'newProject',
  message: 'What action you want to do?',
  choices: [{
    name: 'Create a new ZMP project',
    value: true
  }, {
    name: 'Using ZMP to deploy only',
    value: false
  }]
}, {
  type: 'input',
  name: 'name',
  message: 'App (project) name:',
  "default": 'My App',
  validate: function validate(input) {
    return new Promise(function (resolve, reject) {
      if (!input) reject(new Error('App name is required'));else resolve(true);
    });
  }
}, {
  type: 'list',
  name: 'package',
  when: function when(opts) {
    return opts.newProject;
  },
  message: 'Choose an UI library / UI framework:',
  choices: [{
    name: 'zmp-ui',
    value: 'zmp-ui'
  }]
}, // Framework
{
  type: 'list',
  name: 'framework',
  when: function when(opts) {
    return opts["package"] == 'zmp-framework';
  },
  message: 'What type of framework do you prefer?',
  choices: [{
    name: 'ZMP with React',
    value: 'react'
  }, {
    name: 'ZMP with React (TypeScript)',
    value: 'react-typescript'
  }, {
    name: 'ZMP with Vue.js',
    value: 'vue'
  }, {
    name: 'ZMP Core',
    value: 'core',
    disabled: true
  }]
}, {
  type: 'list',
  name: 'language',
  when: function when(opts) {
    return opts["package"] == 'zmp-ui';
  },
  message: 'What language do you prefer?',
  choices: [{
    name: 'ReactJS',
    value: 'react'
  }]
}, {
  type: 'list',
  name: 'useUIKits',
  when: function when(opts) {
    return opts["package"] === 'zmp-framework' && opts.framework !== 'vue';
  },
  message: 'Do you want to use Zalo UI kits style?',
  "default": true,
  choices: [{
    name: 'Yes, i want to use UI kits style',
    value: true
  }, {
    name: 'No, i want to use only styles with minimal required set of components',
    value: false
  }]
}, // Template
{
  type: 'list',
  name: 'template',
  when: function when(opts) {
    return opts.newProject && opts["package"] === 'zmp-framework' && opts.useUIKits && opts.framework !== 'vue';
  },
  message: 'Choose starter template:',
  choices: [{
    name: 'Blank',
    value: 'blank'
  }, {
    name: 'Single View',
    value: 'single-view'
  }, {
    name: 'Tabs Layout',
    value: 'tabs'
  }]
}, // Template
{
  type: 'list',
  name: 'template',
  when: function when(opts) {
    return opts.newProject && opts["package"] === 'zmp-framework' && !opts.useUIKits && opts.framework !== 'vue';
  },
  message: 'Choose starter template:',
  choices: [{
    name: 'Blank',
    value: 'blank'
  }]
}, {
  type: 'list',
  name: 'cssPreProcessor',
  when: function when(opts) {
    return opts.newProject;
  },
  message: 'Do you want to setup CSS Pre-Processor',
  "default": false,
  choices: [{
    name: 'No, i am good with CSS',
    value: false
  }, {
    name: 'Less',
    value: 'less'
  }, {
    name: 'SCSS (SASS)',
    value: 'scss'
  }, {
    name: 'Stylus',
    value: 'stylus'
  }]
}, // Template
{
  type: 'list',
  name: 'template',
  when: function when(opts) {
    return opts["package"] === 'zmp-ui';
  },
  message: 'Choose starter template:',
  choices: [{
    name: 'Blank',
    value: 'blank'
  }, {
    name: 'Single View',
    value: 'single-view'
  }]
}, // Color
{
  type: 'list',
  name: 'themingCustomColor',
  when: function when(opts) {
    return opts.newProject && opts["package"] !== 'zmp-ui';
  },
  message: 'Do you want to specify custom theme color?',
  choices: [{
    name: 'No, use default color theme',
    value: false
  }, {
    name: 'Yes, i want to specify my brand color',
    value: true
  }]
}, {
  type: 'input',
  name: 'themingColor',
  message: 'Enter custom theme color in HEX format (e.g. ff0000)',
  when: function when(opts) {
    return opts.themingCustomColor === true;
  },
  validate: function validate(input) {
    return new Promise(function (resolve, reject) {
      var num = input.replace(/#/g, '');
      if (num.length === 3 || num.length === 6) resolve(true);else reject(new Error("It doesn't look like a correct HEX number"));
    });
  },
  filter: function filter(input) {
    return input.replace(/#/g, '');
  }
}, {
  type: 'list',
  name: 'themingIconFonts',
  when: function when(opts) {
    return opts.newProject && opts["package"] !== 'zmp-ui';
  },
  message: 'Do you want to include ZMP Icons and Material Icons icon fonts?',
  "default": true,
  choices: [{
    name: 'Yes, include icon fonts',
    value: true
  }, {
    name: 'No, i want to use my own custom icons',
    value: false
  }]
}, {
  type: 'list',
  name: 'moreOptions',
  when: function when(opts) {
    return opts.newProject;
  },
  message: "More Options?\n".concat(moreOptionsText),
  "default": false,
  choices: [{
    name: 'No, I want to complete initializing process now',
    value: false
  }, {
    name: 'Yes, I want to get more options',
    value: true
  }]
}, {
  type: 'list',
  name: 'includeTailwind',
  when: function when(opts) {
    return opts.moreOptions;
  },
  message: 'Do you want to include Tailwind CSS?',
  "default": true,
  choices: [{
    name: 'Yes, I want to iclude Tailwind CSS',
    value: true
  }, {
    name: 'No',
    value: false
  }]
}, {
  type: 'list',
  name: 'stateManagement',
  when: function when(opts) {
    return opts.moreOptions && (opts.framework === 'react' || opts.framework === 'react-typescript');
  },
  message: 'Which state management library would you like to use?',
  "default": 'store',
  choices: [{
    name: 'ZMP Store (Redux pattern)',
    value: 'store'
  }, {
    name: 'Recoil',
    value: 'recoil'
  }]
}];

module.exports = function getOptions() {
  var listQuestion = questions;
  return inquirer.prompt(listQuestion).then(function (options) {
    options.theming = {
      customColor: options.themingCustomColor,
      color: options.themingCustomColor && options.themingColor ? "#".concat(options.themingColor) : '#007aff',
      darkTheme: false,
      iconFonts: options.themingIconFonts,
      fillBars: false,
      useUiKits: options.useUIKits
    };
    options.customBuild = false;
    options.includeTailwind = options.moreOptions && options.includeTailwind;

    if (!options.stateManagement) {
      options.stateManagement = 'store';
    }

    if (options["package"] === 'zmp-ui') {
      options.stateManagement = 'recoil';
    }

    delete options.themingCustomColor;
    delete options.themingColor;
    delete options.themingIconFonts;
    delete options.useUIKits;
    delete options.moreOptions;
    return Promise.resolve(options);
  });
};