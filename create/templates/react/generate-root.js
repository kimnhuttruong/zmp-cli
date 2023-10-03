const templateIf = require('../../utils/template-if');
const indent = require('../../utils/indent');
const appParameters = require('../app-parameters');

module.exports = (options) => {
  const { template, theming, stateManagement } = options;

  // Views
  let views = '';
  if (template === 'single-view' || template === 'blank') {
    views = indent(
      0,
      `
      {/* Your main view, should have "view-main" class */}
      <View main className="safe-areas" url="/" />
    `
    );
  }
  if (template === 'tabs') {
    views = indent(
      0,
      `
    {/* TabView container */}
    <TabView className="safe-areas">
      {/* Tabbar for switching Tab*/}
      <Tabbar bottom id="app-tab-bar">
        <Link tabLink="#view-home" iconZMP="zi-home" tabLinkActive>
          Home
        </Link>
        <Link tabLink="#view-catalog" iconZMP="zi-list-1">
          Catalog
        </Link>
        <Link tabLink="#view-settings" iconZMP="zi-setting">
          Settings
        </Link>
      </Tabbar>

      <View id="view-home" main tab tabActive url="/" />
      <View id="view-catalog" name="catalog" tab url="/catalog/" />
      <View id="view-settings" name="settings" tab url="/settings/" />
    </TabView>
    `
    );
  }

  return indent(
    0,
    `
    import React, { useEffect } from 'react';
    ${['blank', 'single-view'].indexOf(template) >= 0
      ? `
    import { zmpready, App, View } from 'zmp-framework/react';
    `.trim()
      : `
    import { zmpready, App, TabView, View, Tabbar, Link } from 'zmp-framework/react';
    `.trim()
    }
    ${templateIf(stateManagement === 'recoil', () => `import { RecoilRoot } from 'recoil';`, () => `import store from '../store';`)}

    const MyApp = () => {
      // ZMP Parameters
      const zmpparams = {
${indent(8, appParameters(options))}
      };
      useEffect(() => {
        zmpready(() => {
          // Call ZMP APIs here
        });
      }, [])

      ${`
      return (${stateManagement === 'recoil' ? `
        <RecoilRoot>` : ''}
        ${indent(stateManagement === 'recoil' ? 2 : 0, `<App {...zmpparams} ${theming.darkTheme ? 'themeDark' : ''}>`)}
${indent(stateManagement === 'recoil' ? 12 : 10, views.trim())}
        ${indent(stateManagement === 'recoil' ? 2 : 0, `</App>`)}${stateManagement === 'recoil' ? `
        </RecoilRoot>` : ''}
      );
      `.trim()}
    }
    export default MyApp;
  `
  ).trim();
};
