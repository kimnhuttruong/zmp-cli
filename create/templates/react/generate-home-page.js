const indent = require('../../utils/indent');
module.exports = (options) => {
  const { name, template, theming, stateManagement } = options;
  const { fillBars } = theming;

  let description = '';
  if (template === 'single-view' || template === 'blank') {
    description = `
          <p>Here is your blank ZMP app. Let's see what we have here.</p>
    `;
  }
  if (template === 'split-view') {
    description = `
          <p>This is an example of split view application layout, commonly used on tablets. The main approach of such kind of layout is that you can see different views at the same time.</p>

          <p>Each view may have different layout, different navbar type (dynamic, fixed or static) or without navbar.</p>

          <p>The fun thing is that you can easily control one view from another without any line of JavaScript just using "data-view" attribute on links.</p>
    `;
  }
  if (template === 'tabs') {
    description = `
          <p>Here is your blank ZMP app with tabs-layout. Let's see what we have here.</p>
    `;
  }

  return indent(
    0,
    `
    import React from 'react';
    ${
      template === 'blank'
        ? `
    import {
      Page,
      Navbar,
      NavTitleLarge,
      Card
    } from 'zmp-framework/react';
    `.trim()
        : `
    import {
      Page,
      Navbar,
      NavTitleLarge,
      List,
      ListItem,
      Card,
      ${stateManagement === 'store' ? 'useStore,' : ''}
    } from 'zmp-framework/react';${stateManagement === 'recoil' ? `
    import { useRecoilValue } from 'recoil';
    import { userState } from '../state';` : ''}
    import AppItems from '../components/app-items';
    import UserCard from '../components/user-card';
    `.trim()
    }

    const HomePage = () => {
      ${template !== 'blank' ? (stateManagement === 'recoil' ? "const user = useRecoilValue(userState);" : "const user = useStore('user');") : ''}
      return (
        <Page name="home" ${template === 'tabs' ? '' : 'navbarLarge'}>${template !== 'tabs' ? `
          {/* Top Navbar */}
          <Navbar ${fillBars ? 'fill' : ''}>
            <NavTitleLarge>${name}</NavTitleLarge>
          </Navbar>`
              : ''
          }
          {/* Page content */}
          <Card inset>
            ${description.trim()}
          </Card>
          ${
            template !== 'blank' && template !== 'tabs'
              ? `
          {/* User info */}
          <List>
            <ListItem link="/user/">
              <UserCard user={user} />
            </ListItem>
          </List>

          {/* Grid apps */}
          <AppItems />

          {/* Route */}
          <List>
            <ListItem title="Dynamic (Component) Route" link="/dynamic-route/?blog=45&post=125&foo=bar" />
            <ListItem title="Default Route (404)" link="/something-that-doesnt-exist" />
            <ListItem title="About" link="/about/" />
          </List>
          `.trim()
              : ''
          }${template === 'tabs' ? `
          {/* Grid apps */}
          <AppItems />

          {/* Route */}
          <List>
            <ListItem title="Dynamic (Component) Route" link="/dynamic-route/?blog=45&post=125&foo=bar" />
            <ListItem title="Default Route (404)" link="/something-that-doesnt-exist" />
            <ListItem title="About" link="/about/" />
          </List>
          `.trim() : ''}
        </Page>
      );
    }
    
    export default HomePage;
  `
  ).trim();
};
