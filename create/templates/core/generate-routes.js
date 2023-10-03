const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');

module.exports = (options) => {
  const {
    bundler, template,
  } = options;

  let routes;
  if (template === 'blank') {
    if (bundler === 'webpack') {
      routes = indent(0, `
        import HomePage from './pages/home.zmp.html';

        var routes = [
          {
            path: '/',
            component: HomePage,
          },
        ];
      `);
    } else {
      routes = indent(0, `
        var routes = [
          {
            path: '/',
            url: './index.html',
          },
        ];
      `);
    }
  } else if (bundler === 'webpack') {
    routes = indent(0, `
      import HomePage from './pages/home.zmp.html';
      import AboutPage from './pages/about.zmp.html';
      import FormPage from './pages/form.zmp.html';
      ${templateIf(template === 'tabs', () => `
      import CatalogPage from './pages/catalog.zmp.html';
      import ProductPage from './pages/product.zmp.html';
      import SettingsPage from './pages/settings.zmp.html';
      `)}
      ${templateIf(template === 'split-view', () => `
      import LeftPage1 from './pages/left-page-1.zmp.html';
      import LeftPage2 from './pages/left-page-2.zmp.html';
      `)}
      ${templateIf(template !== 'blank', () => `
      import DynamicRoutePage from './pages/dynamic-route.zmp.html';
      import NotFoundPage from './pages/404.zmp.html';
      `)}

      var routes = [
        {
          path: '/',
          component: HomePage,
        },
        {
          path: '/about/',
          component: AboutPage,
        },
        {
          path: '/form/',
          component: FormPage,
        },
        ${templateIf(template === 'tabs', () => `
        {
          path: '/catalog/',
          component: CatalogPage,
        },
        {
          path: '/product/:id/',
          component: ProductPage,
        },
        {
          path: '/settings/',
          component: SettingsPage,
        },
        `)}
        ${templateIf(template === 'split-view', () => `
        {
          path: '/left-page-1/',
          component: LeftPage1,
        },
        {
          path: '/left-page-2/',
          component: LeftPage2,
        },
        `)}
        {
          path: '/dynamic-route/blog/:blogId/post/:postId/',
          component: DynamicRoutePage,
        },
        {
          path: '(.*)',
          component: NotFoundPage,
        },
      ];
    `);
  } else {
    routes = indent(0, `
      var routes = [
        {
          path: '/',
          url: './index.html',
        },
        {
          path: '/about/',
          url: './pages/about.html',
        },
        {
          path: '/form/',
          url: './pages/form.html',
        },
        ${templateIf(template === 'tabs', () => `
        {
          path: '/catalog/',
          componentUrl: './pages/catalog.html',
        },
        {
          path: '/product/:id/',
          componentUrl: './pages/product.html',
        },
        {
          path: '/settings/',
          url: './pages/settings.html',
        },
        `)}
        ${templateIf(template === 'split-view', () => `
        {
          path: '/left-page-1/',
          url: './pages/left-page-1.html',
        },
        {
          path: '/left-page-2/',
          url: './pages/left-page-2.html',
        },
        `)}
        {
          path: '/dynamic-route/blog/:blogId/post/:postId/',
          componentUrl: './pages/dynamic-route.html',
        },
        // Default route (404 page). MUST BE THE LAST
        {
          path: '(.*)',
          url: './pages/404.html',
        },
      ];
    `);
  }

  if (bundler) {
    routes += '\nexport default routes;';
  }

  return routes;
};
