const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const appParameters = require('../app-parameters');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const {
    bundler,
    type,
    cssPreProcessor,
    theming,
    customBuild,
    template,
  } = options;

  let scripts = '';

  if (bundler) {
    scripts += indent(
      0,
      `
      import $ from 'zmp-dom';
      ${templateIf(
        customBuild,
        () => `
      import ZMP from './zmp-custom.js';
      `,
        () => `
      import ZMP from 'zmp-framework/core/bundle';
      `
      )}

      // Import ZMP Styles
      ${templateIf(
        customBuild,
        () => `
      import '../css/zmp-custom.less';
      `,
        () => `
      import 'zmp-framework/zmp-bundle.min.css';
      `
      )}

      // Import Icons and App Custom Styles
      ${templateIf(
        theming.iconFonts,
        () => `
      import '../css/icons.css';
      `
      )}
      import '../css/app.${stylesExtension(cssPreProcessor)}';
      // Import Store
      import store from '../store.js';

      // Import main app component
      import App from '../app.zmp.html';
    `
    );
  } else {
    scripts += indent(
      0,
      `
      var $ = Dom7;
    `
    );
  }

  scripts += indent(
    0,
    `
    var app = new ZMP({
      ${indent(6, appParameters(options)).trim()}
    });
    ${templateIf(
      !bundler && template !== 'blank',
      () => `
    // Login Screen Demo
    $('#my-login-screen .login-button').on('click', function () {
      var username = $('#my-login-screen [name="username"]').val();
      var password = $('#my-login-screen [name="password"]').val();

      // Close login screen
      app.loginScreen.close('#my-login-screen');

      // Alert username and password
      app.dialog.alert('Username: ' + username + '<br/>Password: ' + password);
    });
    `
    )}
  `
  );

  return scripts.trim();
};
