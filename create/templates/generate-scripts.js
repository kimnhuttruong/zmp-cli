const generateCoreScripts = require('./core/generate-scripts');
const generateVueScripts = require('./vue/generate-scripts');
const generateReactScripts = require('./react/generate-scripts');
const generateSvelteScripts = require('./svelte/generate-scripts');
const generateReactTsScripts = require('./react-typescript/generate-scripts');
const generateZauiScripts = require('./zaui/generate-scripts');
module.exports = (options) => {
  const { framework, package } = options;
  if (package === 'zmp-ui') return generateZauiScripts(options);
  if (framework === 'core') return generateCoreScripts(options);
  if (framework === 'vue') return generateVueScripts(options);
  if (framework === 'react') return generateReactScripts(options);
  if (framework === 'svelte') return generateSvelteScripts(options);
  if (framework === 'react-typescript') return generateReactTsScripts(options);
  return '';
};
