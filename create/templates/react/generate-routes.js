module.exports = (options) => {
  const { template } = options;

  if (template === 'blank') {
    return [];
  }
  // Webpack Routes
  const routes = ['/user', '/form', '/dynamic-route', '/about', '/404'];
  if (template === 'tabs') {
    routes.push(...['/catalog', '/settings']);
  } else if (template === 'split-view') {
    routes.push(...['/left-page-1', '/left-page-2']);
  }

  return routes;
};
