/* eslint curly: off */
const { projectFramework } = require('../../utils/constants');
const generateCoreRoot = require('./core/generate-root.js');

module.exports = (options) => {
  const { name, framework, theming } = options;
  const srcFolder = '/src/';
  const iconsAssetsFolder = 'static';

  const rootContent = framework === 'core' ? generateCoreRoot(options) : '';
  const scripts = `
  <!-- built script files will be auto injected -->
  ${
    framework === projectFramework.REACT || framework === projectFramework.VUE
      ? `<script type="module" src="${srcFolder}app.js"></script>`
      : ''
  }
  ${
    framework === projectFramework.REACT_TYPESCRIPT
      ? `<script type="module" src="${srcFolder}app.ts"></script>`
      : ''
  }
  `.trim();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover">

  <meta name="theme-color" content="${
    theming.customColor && theming.color ? `${theming.color}` : '#007aff'
  }">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <link rel="icon" href="${srcFolder}${iconsAssetsFolder}/icons/favicon.png">
  <title>${name}</title>
</head>
<body>
  <div id="app"${
    framework === 'core' && theming.darkTheme ? 'class="theme-dark"' : ''
  }>${rootContent}</div>
  ${scripts}
</body>
</html>
  `.trim();
};
