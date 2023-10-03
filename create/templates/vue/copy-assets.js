const path = require('path');
const generateHomePage = require('./generate-home-page');
const generateRoot = require('./generate-root');
const generateStore = require('../generate-store');

module.exports = (options) => {
  const cwd = options.cwd || process.cwd();
  const { bundler } = options;
  const toCopy = [];

  // Copy Pages
  const pages = ['settings'];

  pages.forEach((p) => {
    const src = path.resolve(__dirname, 'pages', `${p}.vue`);
    const dest = path.resolve(cwd, 'src', 'pages', `${p}.vue`);
    toCopy.push({
      from: src,
      to: dest,
    });
  });
  toCopy.push({
    content: generateHomePage(options),
    to: path.resolve(cwd, 'src', 'pages', 'index.vue'),
  });
  toCopy.push({
    content: generateRoot(options),
    to: path.resolve(cwd, 'src', 'components', 'app.vue'),
  });
  toCopy.push({
    content: generateStore(options),
    to: path.resolve(cwd, 'src', 'store.js'),
  });
  toCopy.push({
    from: path.resolve(__dirname, 'vite.config.js'),
    to: path.resolve(cwd, 'vite.config.js'),
  });
  toCopy.push({
    from: path.resolve(__dirname, 'global-components.d.ts'),
    to: path.resolve(cwd, 'src', 'global-components.d.ts'),
  });
  toCopy.push({
    from: path.resolve(__dirname, 'components', 'header.vue'),
    to: path.resolve(cwd, 'src', 'components', 'header.vue'),
  });
  toCopy.push({
    from: path.resolve(__dirname, 'components', 'sun-and-moon.vue'),
    to: path.resolve(cwd, 'src', 'components', 'sun-and-moon.vue'),
  });
  toCopy.push({
    from: path.resolve(__dirname, 'icons', 'sun.svg'),
    to: path.resolve(cwd, 'src', 'static', 'icons', 'sun.svg'),
  });
  toCopy.push({
    from: path.resolve(__dirname, 'icons', 'moon.svg'),
    to: path.resolve(cwd, 'src', 'static', 'icons', 'moon.svg'),
  });


  if (bundler) {
    toCopy.push({
      from: path.resolve(__dirname, 'babel.config.js'),
      to: path.resolve(cwd, 'babel.config.js'),
    });
  }
  return toCopy;
};
