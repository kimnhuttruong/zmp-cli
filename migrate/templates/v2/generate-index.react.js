/* eslint curly: off */

module.exports = (options) => {
  const { name, type, theming } = options;
  const indexFolder = '/src/';
  const iconsAssetsFolder = 'static';
  const metaTags =
    type.indexOf('pwa') >= 0 || type.indexOf('web') >= 0
      ? `
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="${indexFolder}${iconsAssetsFolder}/icons/apple-touch-icon.png">
  <link rel="icon" href="${indexFolder}${iconsAssetsFolder}/icons/favicon.png">
  `.trim()
      : '';
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
  <title>${name}</title>
  ${metaTags || ''}
  <!-- built styles file will be auto injected -->
</head>
<body>
  <div id="app"></div>
  <script type="module" src="${indexFolder}js/app.js"></script>
  <!-- built script files will be auto injected -->
</body>
</html>
`.trim();
};
