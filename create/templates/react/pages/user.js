const indent = require('../../../utils/indent');

module.exports = (options) => {
  const { template, stateManagement } = options;
  const hideNavBar =
    template === 'tabs'
      ? `
          onPageBeforeIn={()=>{
            //hide navbar
            zmp.toolbar.hide('#app-tab-bar')
          }}`
      : '';
  const modules = ['Avatar', 'List', 'ListItem', 'Page', 'Title'];
  if (stateManagement === 'store') {
    modules.push('useStore');
  }
  if (template === 'tabs') {
    modules.push('zmp');
  }
  return indent(
    0,
    `
    import React from 'react'
    import { ${modules.join(', ')} } from 'zmp-framework/react'
    import NavbarBack from '../components/navbar-back'${stateManagement === 'recoil' ? `
    import { useRecoilValue } from 'recoil';
    import { userState } from '../state';` : ''}

    const UserPage = () => {
      ${stateManagement === 'recoil' ? 'const user = useRecoilValue(userState);' : `const user = useStore('user')`}

      return (
        <Page 
          name="user"${hideNavBar}
        >
          <NavbarBack
            title="User info"
            linkRight="/form"
            labelRight="Edit"
          />
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Avatar story online src={user.avatar.startsWith('http') ? user.avatar : null}>{user.avatar}</Avatar>
            <Title style={{ marginTop: 8 }}>{user.name}</Title>
          </div>
          <List>
            <ListItem title="Display name" after={user.name} />
            <ListItem title="ID" after={user.id} />
          </List>
        </Page>
      )
    }

    export default UserPage;
  `
  ).trim();
};
