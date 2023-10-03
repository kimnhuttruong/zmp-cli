const path = require('path');
const fse = require('../../utils/fs-extra');
const stylesExtension = require('../utils/styles-extension');
const copyVueAssets = require('./vue/copy-assets');
const copyReactAssets = require('./react/copy-assets');
const copyReactTsAssets = require('./react-typescript/copy-assets');
const generateIndex = require('./generate-index');
const generateStyles = require('./generate-styles');
const generateScripts = require('./generate-scripts');
const generateZMPCustom = require('./generate-zmp-custom');
const copyZauiAssets = require('./zaui/copy-assets');
const { projectFramework } = require('../../utils/constants');

module.exports = (options, iconFile) => {
  const cwd = options.cwd || process.cwd();
  const {
    package,
    framework,
    theming,
    cssPreProcessor,
    customBuild,
    includeTailwind,
  } = options;

  const srcFolder = 'src';

  const toCopy = [];
  if (package !== 'zmp-ui') {
    if (framework === projectFramework.VUE)
      toCopy.push(...copyVueAssets(options));
    if (framework === projectFramework.REACT)
      toCopy.push(...copyReactAssets(options));
    if (framework === projectFramework.REACT_TYPESCRIPT) {
      toCopy.push(...copyReactTsAssets(options));
    }
  } else {
    toCopy.push(...copyZauiAssets(options));
  }
  if (theming.iconFonts) {
    // Copy Icons CSS
    toCopy.push({
      from: path.resolve(__dirname, 'common', 'css', 'icons.css'),
      to: path.resolve(cwd, srcFolder, 'css', 'icons.css'),
    });
  }

  if (includeTailwind) {
    toCopy.push(
      {
        from: path.resolve(__dirname, 'common', 'tailwind', 'tailwind.css'),
        to: path.resolve(cwd, srcFolder, 'css', 'tailwind.css'),
      },
      {
        from: path.resolve(
          __dirname,
          'common',
          'tailwind',
          'tailwind.config.js'
        ),
        to: path.resolve(cwd, 'tailwind.config.js'),
      },
      {
        from: path.resolve(
          __dirname,
          'common',
          'tailwind',
          'postcss.config.js'
        ),
        to: path.resolve(cwd, 'postcss.config.js'),
      }
    );
  }

  let appScriptFileName = 'app.js';
  if (framework === 'react-typescript') {
    appScriptFileName = 'app.ts';
  }

  // Copy Main Assets
  toCopy.push(
    ...[
      {
        content: generateIndex(options),
        to: path.resolve(cwd, 'index.html'),
      },
      {
        content: generateStyles(options),
        to: path.resolve(
          cwd,
          srcFolder,
          'css',
          `app.${stylesExtension(cssPreProcessor)}`
        ),
      },
      {
        content: generateScripts(options),
        to: path.resolve(cwd, srcFolder, appScriptFileName),
      },
    ]
  );

  // Copy Custom Build
  if (customBuild) {
    const customBuildAssets = generateZMPCustom(options);
    toCopy.push(
      ...[
        {
          content: customBuildAssets.styles,
          to: path.resolve(cwd, srcFolder, 'css', 'zmp-custom.less'),
        },
        {
          content: customBuildAssets.scripts,
          to: path.resolve(cwd, srcFolder, 'js', 'zmp-custom.js'),
        },
      ]
    );
  }

  if (!includeTailwind) {
    // Copy PostCSS config
    toCopy.push({
      from: path.resolve(__dirname, 'common', 'postcss.config.js'),
      to: path.resolve(cwd, 'postcss.config.js'),
    });
  }

  // Copy Web Images & Icons
  const assetsFolder = 'static';
  fse.readdirSync(path.resolve(__dirname, 'common', 'icons')).forEach((f) => {
    if (f.indexOf('.') === 0) return;
    toCopy.push({
      from: path.resolve(__dirname, 'common', 'icons', f),
      to: path.resolve(cwd, srcFolder, assetsFolder, 'icons', f),
    });
  });

  if (iconFile) {
    fse.writeFileSync(
      path.resolve(cwd, 'assets-src', 'web-icon.png'),
      iconFile
    );
    fse.writeFileSync(
      path.resolve(cwd, 'assets-src', 'apple-touch-icon.png'),
      iconFile
    );
  } else {
    toCopy.push({
      from: path.resolve(__dirname, 'common', 'icons', '512x512.png'),
      to: path.resolve(cwd, 'assets-src', 'web-icon.png'),
    });
    toCopy.push({
      from: path.resolve(__dirname, 'common', 'icons', 'apple-touch-icon.png'),
      to: path.resolve(cwd, 'assets-src', 'apple-touch-icon.png'),
    });
  }

  return toCopy;
};
