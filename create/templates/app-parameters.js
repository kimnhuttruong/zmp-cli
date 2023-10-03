const indent = require('../utils/indent');
const templateIf = require('../utils/template-if');

module.exports = (options) => {
  const { framework, pkg, name, bundler, stateManagement } = options;

  return indent(
    0,
    `
    name: '${name}', // App name
    theme: 'auto', // Automatic theme detection
    ${templateIf(stateManagement === 'store', () => `
    // App store
    store: store,
    `)}
    ${templateIf(framework === 'core', () => `el: '#app', // App root element`)}
    ${templateIf(
      framework === 'core' && bundler,
      () => `component: App, // App main component`
    )}
    ${templateIf(pkg, () => `id: '${pkg}', // App bundle ID`)}
    ${templateIf(
      framework === 'core',
      () => ` on: {
      init: function () {
        var zmp = this;
      },
    },
    `
    )}
    `
  ).trim();
};
