const generateNpmScripts = require('./generate-npm-scripts');
const { generateTailWindScripts } = require('./generate-npm-scripts');

module.exports = function generatePackageJson(options) {
  const {
    name,
    package,
    framework,
    cssPreProcessor,
    includeTailwind,
    stateManagement,
  } = options;

  // Dependencies
  const dependencies =
    package === 'zmp-ui'
      ? ['zmp-ui', 'zmp-sdk', 'react-router-dom']
      : ['zmp-framework', 'zmp-sdk', 'swiper'];
  const dependenciesVue = ['vue@3', 'zmp-framework'];
  const dependenciesReact = ['react', 'react-dom', 'prop-types'];
  const tailwindDependencies = [
    'autoprefixer',
    'tailwindcss',
    'postcss@^8',
    'postcss-cli@^8',
  ];
  const recoilDependencies = ['recoil'];

  if (framework === 'vue') {
    dependencies.push(...dependenciesVue);
  } else if (framework === 'react' || framework === 'react-typescript') {
    dependencies.push(...dependenciesReact);
    if (stateManagement === 'recoil') {
      dependencies.push(...recoilDependencies);
    }
  }

  const devDependencies = [
    'cross-env',
    'postcss-preset-env@6.7.0',
    'vite@2.6.14',
  ];
  if (framework === 'react-typescript') {
    devDependencies.push('@types/react', '@types/react-dom');
    if (package === 'zmp-ui') {
      devDependencies.push('@types/react-router-dom');
    }
  }
  // CSS PreProcessor
  if (cssPreProcessor === 'stylus') devDependencies.push(...['stylus']);
  else if (cssPreProcessor === 'less') devDependencies.push(...['less']);
  else if (cssPreProcessor === 'scss') devDependencies.push(...['sass']);

  // DevDependencies
  const devDependenciesCore = ['zmp-loader'];
  const devDependenciesReact = ['@vitejs/plugin-react-refresh'];
  const devDependenciesVue = ['@vitejs/plugin-vue@2.3.3', '@vue/compiler-sfc'];

  if (framework === 'react' || framework === 'react-typescript')
    devDependencies.push(
      ...[devDependenciesReact],
      ...(includeTailwind ? tailwindDependencies : [])
    );
  else if (framework === 'vue')
    devDependencies.push(
      ...devDependenciesVue,
      ...(includeTailwind ? tailwindDependencies : [])
    );
  else if (framework === 'core')
    devDependencies.push(
      ...devDependenciesCore,
      ...(includeTailwind ? tailwindDependencies : [])
    );

  if (package === 'zmp-ui') {
    dependencies.push('recoil');
    dependencies.push(...dependenciesReact);
    devDependencies.push(
      ...[devDependenciesReact],
      ...(includeTailwind ? tailwindDependencies : [])
    );
  }
  // Scripts
  const scripts = {};
  generateNpmScripts().forEach((s) => {
    scripts[s.name] = s.script;
  });
  if (includeTailwind) {
    generateTailWindScripts().forEach((s) => {
      scripts[s.name] = s.script;
    });
  }
  const postInstall = [];

  if (postInstall.length) {
    scripts.postinstall = postInstall.join(' && ');
  }

  // Content
  const content = `
{
  "name": "${name
    .toLowerCase()
    .replace(/[ ]{2,}/, ' ')
    .replace(/ /g, '-')}",
  "private": true,
  "version": "1.0.0",
  "description": "${name}",
  "repository" : "",
  "license" : "UNLICENSED",
  "browserslist": [
    "Android >= 5",
    "IOS >= 9.3",
    "Edge >= 15",
    "Safari >= 9.1",
    "Chrome >= 49",
    "Firefox >= 31",
    "Samsung >= 5"
  ],
  "scripts" : ${JSON.stringify(scripts)},
  "dependencies": {},
  "devDependencies": {}
}
`.trim();

  return {
    content,
    dependencies,
    devDependencies,
    postInstall,
  };
};
