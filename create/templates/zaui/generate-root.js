const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const { capitalize } = require('../../utils/string')
module.exports = (options) => {
  const { template, theming, stateManagement } = options;

  // Views

  const routes = []
  if(template ==='single-view'){
    routes.push('about','form','user')
  }
  return indent(
    0,
    `
    import React from 'react';
    import { Route} from 'react-router-dom'
    ${['blank', 'single-view'].indexOf(template) >= 0
    ? `
    import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui';
    `.trim(): ''
    } 
    ${templateIf(stateManagement === 'recoil', () => `import { RecoilRoot } from 'recoil';`,'')}
    import HomePage from '../pages';
    ${routes.length>0 ? routes.map((route) => `    import ${capitalize(route)} from '../pages/${route}';\n`).join('').trim():''}


    const MyApp = () => {
      ${`
      return (${stateManagement === 'recoil' ? `
        <RecoilRoot>` : ''}
        ${indent(stateManagement === 'recoil' ? 2 : 0, `<App ${theming.darkTheme ? 'themeDark' : ''}>`)}
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path="/" element={<HomePage></HomePage>}></Route>
                ${routes.length>0 ? routes.map((route) =>{
                  const pageName = capitalize(route)
                  return `              <Route path="/${route}" element={<${pageName}></${pageName}>}></Route>\n`
                }).join('').trim(): ''
              }
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        ${indent(stateManagement === 'recoil' ? 2 : 0, `</App>`)}${stateManagement === 'recoil' ? `
        </RecoilRoot>` : ''}
      );
      `.trim()}
    }
    export default MyApp;
  `
  ).trim();
};
