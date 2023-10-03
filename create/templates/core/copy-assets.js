const path = require('path');
const fse = require('../../../utils/fs-extra');
const generateHomePage = require('./generate-home-page');
const generateRoot = require('./generate-root');
const generateStore = require('../generate-store');
const indent = require('../../utils/indent');

module.exports = (options) => {
  const cwd = options.cwd || process.cwd();
  const { template, bundler } = options;
  const toCopy = [];
  const srcFolder = bundler ? 'src' : 'www';

  // Copy Pages
  const pages = [
    ...(template !== 'blank' ? ['404', 'about', 'dynamic-route', 'form'] : []),
    ...(template === 'tabs' ? ['catalog', 'product', 'settings'] : []),
    ...(template === 'split-view' ? ['left-page-1', 'left-page-2'] : []),
  ];

  pages.forEach((p) => {
    const src = path.resolve(__dirname, 'pages', `${p}.html`);
    const dest = path.resolve(cwd, srcFolder, 'pages');
    if (bundler !== 'webpack') {
      toCopy.push({
        from: src,
        to: path.resolve(dest, `${p}.html`),
      });
    } else {
      let content = fse.readFileSync(src);
      if (content.trim().indexOf('<template') !== 0) {
        content = `<template>\n${content.trim()}\n</template>\n<script>\nexport default () => {\n  return $render;\n};\n</script>`;
      }
      toCopy.push({
        content,
        to: path.resolve(dest, `${p}.zmp.html`),
      });
    }
  });
  toCopy.push({
    content: generateStore(options),
    to: path.resolve(cwd, srcFolder, 'store.js'),
  });

  if (bundler) {
    toCopy.push({
      content: `<template>\n${indent(
        2,
        generateHomePage(options).trim()
      )}\n</template>\n<script>\nexport default () => {\n  return $render;\n}\n</script>`,
      to: path.resolve(cwd, srcFolder, 'pages', 'home.zmp.html'),
    });
    toCopy.push({
      content: generateRoot(options),
      to: path.resolve(cwd, srcFolder, 'app.zmp.html'),
    });

    toCopy.push({
      from: path.resolve(__dirname, 'babel.config.js'),
      to: path.resolve(cwd, 'babel.config.js'),
    });
  } else {
    // Copy ZMP
    toCopy.push(...[]);
    fse
      .readdirSync(path.resolve(cwd, 'node_modules', 'zmp-framework/core'))
      .filter((f) => {
        return (
          f.indexOf('.js') >= 0 ||
          f.indexOf('.css') >= 0 ||
          f.indexOf('.map') >= 0
        );
      })
      .forEach((f) => {
        toCopy.push({
          from: path.resolve(cwd, 'node_modules', 'zmp-framework/core', f),
          to: path.resolve(cwd, srcFolder, 'zmp-framework/core', f),
        });
      });
  }

  return toCopy;
};
