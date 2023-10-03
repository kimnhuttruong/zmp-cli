const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');

module.exports = (options) => {
  const {
    template,
  } = options;

  if (template === 'blank') {
    return indent(0, `
      import HomePage from './pages/home.svelte';

      var routes = [
        {
          path: '/',
          component: HomePage,
        },
      ];

      export default routes;
    `);
  }
  // Webpack Routes
  const routes = indent(0, `
    import HomePage from './pages/home.svelte';
    import AboutPage from './pages/about.svelte';
    import FormPage from './pages/form.svelte';
    ${templateIf(template === 'tabs', () => `
    import CatalogPage from './pages/catalog.svelte';
    import ProductPage from './pages/product.svelte';
    import SettingsPage from './pages/settings.svelte';
    `)}
    ${templateIf(template === 'split-view', () => `
    import LeftPage1 from './pages/left-page-1.svelte';
    import LeftPage2 from './pages/left-page-2.svelte';
    `)}
    import DynamicRoutePage from './pages/dynamic-route.svelte';
    import NotFoundPage from './pages/404.svelte';

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

    export default routes;
  `);

  return routes;
};
