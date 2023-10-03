const indent = require('../utils/indent');
const { colorThemeCSSProperties } = require('../utils/colors');

module.exports = (options) => {
  const { template, theming, package } = options;
  const { customColor, color, fillBars } = theming;

  let styles = '';

  if (package === 'zmp-ui') {
    return `
    .page {
      padding: 16px 16px 96px 16px;
    }
    
    .section-container {
      padding: 16px;
      background: #ffffff;
      border-radius: 8px;
      margin-bottom: 24px;
    }    
    `;
  }

  let themeRgb = [0, 122, 255];

  if (customColor && color) {
    const customProps = colorThemeCSSProperties(`${color}`);
    themeRgb = customProps['--zmp-theme-color-rgb']
      .split(',')
      .map((n) => n.trim());
    styles += indent(
      0,
      `
      /* Custom color theme properties */
      :root {
        ${Object.keys(customProps)
          .filter(
            (prop) =>
              prop !== '--zmp-tabbar-fill-link-active-color' &&
              prop !== '--zmp-tabbar-fill-link-active-border-color'
          )
          .map((prop) => `${prop}: ${customProps[prop]};`)
          .join('\n        ')}
      }
      :root.theme-dark,:root .theme-dark {
        ${Object.keys(customProps)
          .map((prop) => `${prop}: ${customProps[prop]};`)
          .join('\n        ')} 
      }
    `
    );
  }
  if (fillBars) {
    styles += indent(
      0,
      `
      /* Invert navigation bars to fill style */
    `
    );
  }

  if (template === 'split-view') {
    styles += indent(
      0,
      `
      /* Left Panel right border when it is visible by breakpoint */
      .panel-left.panel-in-breakpoint:before {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 1px;
        background: rgba(0,0,0,0.1);
        content: '';
        z-index: 6000;
      }

      /* Hide navbar link which opens left panel when it is visible by breakpoint */
      .panel-left.panel-in-breakpoint ~ .view .navbar .panel-open[data-panel="left"] {
        display: none;
      }

      /*
        Extra borders for main view and left panel for iOS theme when it behaves as panel (before breakpoint size)
      */
      .ios .panel-left:not(.panel-in-breakpoint).panel-in ~ .view-main:before,
      .ios .panel-left:not(.panel-in-breakpoint).panel-closing ~ .view-main:before {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 1px;
        background: rgba(0,0,0,0.1);
        content: '';
        z-index: 6000;
      }
    `
    );
  } else {
    styles += indent(
      0,
      `
      /* Your app custom styles here */
    `
    );
  }

  return styles.trim();
};
