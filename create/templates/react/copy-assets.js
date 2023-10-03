const path = require('path');
const generateHomePage = require('./generate-home-page');
const generateRoot = require('./generate-root');
const generateStore = require('../generate-store');
const generateRecoil = require('../generate-recoil');
const copyPages = require('./pages');

module.exports = (options) => {
  const cwd = options.cwd || process.cwd();
  const { template, stateManagement } = options;
  const toCopy = [];

  // Copy Pages

  let pages = [];
  if (template !== 'blank')
    pages.push(
      ...[
        { fileName: '404', content: 'copy404' },
        { fileName: 'about', content: 'copyAbout' },
        { fileName: 'dynamic-route', content: 'copyDynamicRoute' },
        { fileName: 'user', content: 'copyUser' },
        { fileName: 'form', content: 'copyForm' },
      ]
    );
  if (template === 'tabs') {
    pages.push(
      ...[
        { fileName: 'catalog', content: 'copyCatalog' },
        { fileName: 'settings', content: 'copySettings' },
      ]
    );
  }

  pages.forEach(({ fileName, content }) => {
    const dest = path.resolve(cwd, 'src', 'pages', `${fileName}.jsx`);
    toCopy.push({
      content: copyPages[content](options),
      to: dest,
    });
  });


  toCopy.push({
    content: generateHomePage(options),
    to: path.resolve(cwd, 'src', 'pages', 'index.jsx'),
  });

  // Copy compoents
  const components = [
    ...(template !== 'blank' ? ['app-items', 'navbar-back', 'user-card'] : []),
  ];
  components.forEach((name) => {
    const src = path.resolve(__dirname, 'components', `${name}.jsx`);
    const dest = path.resolve(cwd, 'src', 'components', `${name}.jsx`);
    toCopy.push({
      from: src,
      to: dest,
    });
  });

  toCopy.push({
    content: generateRoot(options),
    to: path.resolve(cwd, 'src', 'components', 'app.jsx'),
  });

  if (stateManagement === 'recoil') {
    toCopy.push({
      content: generateRecoil(options),
      to: path.resolve(cwd, 'src', 'state.js'),
    });
  } else {
    toCopy.push({
      content: generateStore(options),
      to: path.resolve(cwd, 'src', 'store.js'),
    });
  }

  toCopy.push({
    from: path.resolve(__dirname, 'vite.config.js'),
    to: path.resolve(cwd, 'vite.config.js'),
  });

  return toCopy;
};
