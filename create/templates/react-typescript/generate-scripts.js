const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const { cssPreProcessor, theming, customBuild, includeTailwind } = options;
  let scripts = '';

  scripts += indent(
    0,
    `
    // Import React and ReactDOM
    import React from 'react';
    import { createRoot } from 'react-dom/client';

    // Import ZMP
    import ZMP from '${
      customBuild ? './zmp-custom.js' : 'zmp-framework/core/lite-bundle'
    }';

    // Import ZMP-React Plugin
    import ZMPReact from 'zmp-framework/react';${includeTailwind ? `

    // Import tailwind styles
    import './css/tailwind.css';` : ''}

    // Import ZMP Styles
    ${templateIf(
      customBuild,
      () => `
    import './css/zmp-custom.less';
    `,
      () => `
    import 'zmp-framework/${
      theming.useUiKits ? 'zmp-bundle.min.css' : 'zmp.min.css'
    }';
    `
    )}

    // Import Icons and App Custom Styles
    ${templateIf(
      theming.iconFonts,
      () => `
    import './css/icons.css';
    `
    )}
    import './css/app.${stylesExtension(cssPreProcessor)}';

    // Import App Component
    import App from './components/app';
    import appConfig from '../app-config.json';

    if (!(window as any).APP_CONFIG) {
      (window as any).APP_CONFIG = appConfig
    } 

    // Init ZMP React Plugin
    ZMP.use(ZMPReact)

    // Mount React App
    const root = createRoot(document.getElementById('app')!);
    root.render(React.createElement(App));
  `
  );

  return scripts.trim();
};
