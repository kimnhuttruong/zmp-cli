const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const stylesExtension = require('../../utils/styles-extension');

module.exports = (options) => {
  const {
    cssPreProcessor,
    theming,
    customBuild,
  } = options;

  let scripts = '';

  scripts += indent(0, `
    // Import ZMP
    import ZMP from '${customBuild ? './zmp-custom.js' : 'zmp-framework/core/lite-bundle'}';

    // Import ZMP-Svelte Plugin
    import ZMPSvelte from 'zmp-svelte';

    // Import ZMP Styles
    ${templateIf(customBuild, () => `
    import '../css/zmp-custom.less';
    `, () => `
    import 'zmp-framework/zmp-bundle.min.css';
    `)}

    // Import Icons and App Custom Styles
    ${templateIf(theming.iconFonts, () => `
    import '../css/icons.css';
    `)}
    import '../css/app.${stylesExtension(cssPreProcessor)}';

    // Import App Component
    import App from '../components/app.svelte';

    // Init ZMP Svelte Plugin
    ZMP.use(ZMPSvelte)

    // Mount Svelte App
    const app = new App({
      target: document.getElementById('app'),
    });
  `);

  return scripts.trim();
};
