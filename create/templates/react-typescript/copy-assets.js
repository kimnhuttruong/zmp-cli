const path = require('path');
const generateHomePage = require('./generate-home-page');
const generateRoot = require('./generate-root');
const generateStore = require('../generate-store');
const generateRecoil = require('../generate-recoil');
const copyComponents = require('./components');
const copyPages = require('./pages');
const copyViteConfig = require('./vite.config');

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
    const dest = path.resolve(cwd, 'src', 'pages', `${fileName}.tsx`);
    toCopy.push({
      content: copyPages[content](options),
      to: dest,
    });
  });
  toCopy.push({
    content: generateHomePage(options),
    to: path.resolve(cwd, 'src', 'pages', 'index.tsx'),
  });

  // Copy compoents
  const components = [
    ...(template !== 'blank'
      ? [
        { fileName: 'app-items', content: 'copyAppItems' },
        { fileName: 'navbar-back', content: 'copyNavbarBack' },
        { fileName: 'user-card', content: 'copyUserCard' },
      ]
      : []),
  ];
  components.forEach(({ fileName, content }) => {
    const dest = path.resolve(cwd, 'src', 'components', `${fileName}.tsx`);
    toCopy.push({
      content: copyComponents[content](options),
      to: dest,
    });
  });

  toCopy.push({
    content: generateRoot(options),
    to: path.resolve(cwd, 'src', 'components', 'app.tsx'),
  });

  if (stateManagement === 'recoil') {
    toCopy.push({
      content: generateRecoil(options),
      to: path.resolve(cwd, 'src', 'state.ts'),
    });
  } else {
    toCopy.push({
      content: generateStore(options),
      to: path.resolve(cwd, 'src', 'store.ts'),
    });
  }

  toCopy.push({
    content: copyViteConfig(options),
    to: path.resolve(cwd, 'vite.config.ts'),
  });

  toCopy.push({
    from: path.resolve(__dirname, '_tsconfig.json'),
    to: path.resolve(cwd, 'tsconfig.json'),
  });

  return toCopy;
};
