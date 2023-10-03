const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const {
    cssPreProcessor,
    theming,
    customBuild,
    includeTailwind
  } = options;

  let scripts = '';

  scripts += indent(0, `
    // Import Vue
    import { createApp } from 'vue';

    // Import ZMP
    import ZMP from '${customBuild ? './zmp-custom.js' : 'zmp-framework/core/lite-bundle'}';

    // Import ZMP-Vue Plugin
    import ZMPVue, { registerComponents } from 'zmp-vue/bundle';${includeTailwind ? `

    // Import tailwind styles
    import './css/tailwind.css';` : ''}

    // Import ZMP Styles
    ${templateIf(customBuild, () => `
    import '../css/zmp-custom.less';
    `, () => `
    import 'zmp-framework/zmp-bundle.min.css';
    `)}

    // Import Icons and App Custom Styles
    ${templateIf(theming.iconFonts, () => `
    import './css/icons.css';
    `)}
    import './css/app.${stylesExtension(cssPreProcessor)}';

    // Import App Component
    import App from './components/app.vue';
    import appConfig from '../app-config.json';

    if (!window.APP_CONFIG) {
      window.APP_CONFIG = appConfig;
    }

    // Init ZMP-Vue Plugin
    ZMP.use(ZMPVue);

    // Init App
    const app = createApp(App);

    // Register ZMP Vue components
    registerComponents(app);

    // Mount the app
    app.mount('#app');
  `);

  return scripts.trim();
};
