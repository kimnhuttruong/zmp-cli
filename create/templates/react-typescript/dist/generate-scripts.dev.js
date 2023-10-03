"use strict";

var templateIf = require('../../utils/template-if');

var indent = require('../../utils/indent');

var stylesExtension = require('../../utils/styles-extension');

module.exports = function (options) {
  var cssPreProcessor = options.cssPreProcessor,
      theming = options.theming,
      customBuild = options.customBuild,
      includeTailwind = options.includeTailwind;
  var scripts = '';
  scripts += indent(0, "\n    // Import React and ReactDOM\n    import React from 'react';\n    import { createRoot } from 'react-dom/client';\n\n    // Import ZMP\n    import ZMP from '".concat(customBuild ? './zmp-custom.js' : 'zmp-framework/core/lite-bundle', "';\n\n    // Import ZMP-React Plugin\n    import ZMPReact from 'zmp-framework/react';").concat(includeTailwind ? "\n\n    // Import tailwind styles\n    import './css/tailwind.css';\n    " : '', "\n\n    // Import ZMP Styles\n    ").concat(templateIf(customBuild, function () {
    return "\n    import './css/zmp-custom.less';\n    ";
  }, function () {
    return "\n    import 'zmp-framework/".concat(theming.useUiKits ? 'zmp-bundle.min.css' : 'zmp.min.css', "';\n    ");
  }), "\n\n    // Import Icons and App Custom Styles\n    ").concat(templateIf(theming.iconFonts, function () {
    return "\n    import './css/icons.css';\n    ";
  }), "\n    import './css/app.").concat(stylesExtension(cssPreProcessor), "';\n\n    // Import App Component\n    import App from './components/app';\n    import appConfig from '../app-config.json';\n\n    if (!(window as any).APP_CONFIG) {\n      (window as any).APP_CONFIG = appConfig\n    }\n\n    // Init ZMP React Plugin\n    ZMP.use(ZMPReact)\n\n    // Mount React App\n    const root = createRoot(document.getElementById('app')!);\n    root.render(React.createElement(App));\n  "));
  return scripts.trim();
};