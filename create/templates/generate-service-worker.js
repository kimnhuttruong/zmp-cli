const indent = require('../utils/indent');
const templateIf = require('../utils/template-if');

module.exports = (options) => {
  const { bundler, theming } = options;
  return indent(0, `
    // Import Workbox (https://developers.google.com/web/tools/workbox/)
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

    /*
      Precache Manifest
      Change revision as soon as file content changed
    */
    self.__WB_MANIFEST = [
      {
        revision: '1',
        url: 'zmp/zmp-bundle.min.css'
      },
      {
        revision: '1',
        url: 'zmp/zmp-bundle.min.js'
      },
      {
        revision: '1',
        url: 'css/app.css'
      },
      ${templateIf(theming.iconFonts, () => `
      {
        revision: '1',
        url: 'css/icons.css'
      },
      `)}
      {
        revision: '1',
        url: 'routes.js'
      },
      {
        revision: '1',
        url: 'store.js'
      },
      {
        revision: '1',
        url: 'app.js'
      },
      ${templateIf(theming.iconFonts, () => `
      // Fonts
      {
        revision: '1',
        url: 'fonts/ZMPIcons-Regular.woff2'
      },
      {
        revision: '1',
        url: 'fonts/ZMPIcons-Regular.woff'
      },
      {
        revision: '1',
        url: 'fonts/ZMPIcons-Regular.eot'
      },
      {
        revision: '1',
        url: 'fonts/ZMPIcons-Regular.ttf'
      },
      {
        revision: '1',
        url: 'fonts/MaterialIcons-Regular.woff2'
      },
      {
        revision: '1',
        url: 'fonts/MaterialIcons-Regular.woff'
      },
      {
        revision: '1',
        url: 'fonts/MaterialIcons-Regular.ttf'
      },
      {
        revision: '1',
        url: 'fonts/MaterialIcons-Regular.eot'
      },
      `)}
      // HTML
      {
        revision: '1',
        url: './index.html'
      },
      // Icons
      {
        revision: '1',
        url: 'assets/icons/128x128.png'
      },
      {
        revision: '1',
        url: 'assets/icons/144x144.png'
      },
      {
        revision: '1',
        url: 'assets/icons/152x152.png'
      },
      {
        revision: '1',
        url: 'assets/icons/192x192.png'
      },
      {
        revision: '1',
        url: 'assets/icons/256x256.png'
      },
      {
        revision: '1',
        url: 'assets/icons/512x512.png'
      },
      {
        revision: '1',
        url: 'assets/icons/favicon.png'
      },
      {
        revision: '1',
        url: 'assets/icons/apple-touch-icon.png'
      },
    ];

    /*
      Enable precaching
      It is better to comment next line during development
    */
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
  `).trim();
};
