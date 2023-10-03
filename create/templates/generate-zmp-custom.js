const indent = require('../utils/indent');

module.exports = (options) => {
  const {
    themes = [],
    rtl = false,
    lightTheme = true,
    darkTheme = true,
    components = [],
  } = options.customBuildConfig || {};

  const filterCharts = (comps) => {
    return comps.filter((c) => {
      if (c === 'gauge' || c === 'area-chart' || c === 'pie-chart')
        return false;
      return true;
    });
  };

  const { framework } = options;

  const componentsImportsJS = filterCharts(components).map((c) => {
    const name = c
      .split('-')
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join('');
    return `import ${name} from 'zmp-framework/core/components/${c}';`;
  });
  const componentsNamesJS = filterCharts(components).map((c) => {
    return c
      .split('-')
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join('');
  });

  const scripts = indent(
    0,
    `
    import ZMP, { request, utils, getDevice, createStore } from '${
      framework === 'core' ? 'zmp-framework/core' : 'zmp-framework/core/lite'
    }';
    ${componentsImportsJS.join('\n    ')}

    ZMP.use([
      ${componentsNamesJS.join(',\n      ')}
    ]);

    export default ZMP;
    export { request, utils, getDevice, createStore };
  `
  );

  const componentsImportsLESS = components.map((c) => {
    return `@import url('../../node_modules/zmp/components/${c}/${c}.less');`;
  });
  const styles = indent(
    0,
    `
    & {
      @import url('../../node_modules/zmp/zmp.less');
      ${componentsImportsLESS.join('\n      ')}

      @includeIosTheme: ${themes.indexOf('ios') >= 0};
      @includeMdTheme: ${themes.indexOf('md') >= 0};
      @includeAuroraTheme: ${themes.indexOf('aurora') >= 0};
      @includeDarkTheme: ${darkTheme || false};
      @includeLightTheme: ${lightTheme || false};
      @rtl: ${rtl}
    }
  `
  );

  return {
    styles,
    scripts,
  };
};
