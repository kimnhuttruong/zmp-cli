const indent = require('../../utils/indent');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const { cssPreProcessor,  includeTailwind, framework } = options;

  let scripts = '';

  scripts += indent(
    0,
    `
    // Import React and ReactDOM
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    ${includeTailwind ? `

    // Import tailwind styles
    import './css/tailwind.css';` : ''}

    import 'zmp-ui/zaui.css'; 

    import './css/app.${stylesExtension(cssPreProcessor)}';

    // Import App Component
    import App from './components/app';
    import appConfig from '../app-config.json';

    if (!window.APP_CONFIG) {
      window.APP_CONFIG = appConfig;
    }

    // Mount React App
    ${framework === 'react-typescript' ? "const root = createRoot(document.getElementById('app')!);" : "const root = createRoot(document.getElementById('app'));"}
    root.render(React.createElement(App));
  `
  );

  return scripts.trim();
};
