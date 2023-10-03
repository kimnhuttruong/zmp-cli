const path = require('path');
const generateHomePage = require('./generate-home-page');
const generateRoot = require('./generate-root');
const generateRecoil = require('../generate-recoil');
const generateUserCard = require('./generate-user-card');
const copyPages = require('./pages');
const { projectFramework } = require('../../../utils/constants');
const fse = require('../../../utils/fs-extra');

module.exports = (options) => {
  const cwd = options.cwd || process.cwd();
  const { template, stateManagement, framework } = options;
  const toCopy = [];

  // Copy Pages

  const ext = framework === projectFramework.REACT_TYPESCRIPT ?'tsx': 'jsx'

  let pages = [];
  if (template !== 'blank')
    pages.push(
      ...[
        { fileName: 'about', content: 'copyAbout' },
        { fileName: 'user', content: 'copyUser' },
        { fileName: 'form', content: 'copyForm' },
      ]
    );


  pages.forEach(({ fileName, content }) => {
    const dest = path.resolve(cwd, 'src', 'pages', `${fileName}.${ext}`);
    toCopy.push({
      content: copyPages[content](options),
      to: dest,
    });
  });


  toCopy.push({
    content: generateHomePage(options),
    to: path.resolve(cwd, 'src', 'pages', `index.${ext}`),
  });

  if(template !== 'blank') {
    toCopy.push({
      content: generateUserCard(options),
      to: path.resolve(cwd, 'src','components', `user-card.${ext}`)
    })
  }


  toCopy.push({
    content: generateRoot(options),
    to: path.resolve(cwd, 'src', 'components', `app.${ext}`),
  });

  if(framework === projectFramework.REACT_TYPESCRIPT){
    if (stateManagement === 'recoil') {
      toCopy.push({
        content: generateRecoil(options),
        to: path.resolve(cwd, 'src', 'state.ts'),
      });
    } 

  
  }else {
    if (stateManagement === 'recoil') {
      toCopy.push({
        content: generateRecoil(options),
        to: path.resolve(cwd, 'src', 'state.js'),
      });
    } 
  
  }
  const isTs = framework === projectFramework.REACT_TYPESCRIPT

  toCopy.push({
    content: fse.readFileSync(path.resolve(__dirname, 'vite.config.js'),'utf8'),
    to: path.resolve(cwd, `vite.config.${isTs ? 'ts':'js'}`),
  });

  if(framework === projectFramework.REACT_TYPESCRIPT){
    toCopy.push({
      from: path.resolve(__dirname, '_tsconfig.json'),
      to: path.resolve(cwd, 'tsconfig.json')
    })
  }

  return toCopy;
};
