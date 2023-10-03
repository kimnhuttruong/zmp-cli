const indent = require('../../../utils/indent');

// eslint-disable-next-line no-unused-vars
module.exports = (options) => {
  if (options.stateManagement === 'recoil') {
    return indent(
      0,
      `
      import React from "react";
      import { useRecoilValue } from 'recoil';
      import {
        Page,
        List,
        ListItem,
        Title,
        Box
      } from "zmp-framework/react";
      import UserCard from "../components/user-card";
      import { userState } from '../state'
  
      const SettingsPage = () => {
        const user = useRecoilValue(userState);
  
        return (
          <Page name="settings">
            <Box m="0" p="4">
              <Title>Settings</Title>
              <List className="m-0">
                <ListItem link="/user/">
                  <UserCard user={user} />
                </ListItem>
              </List>
            </Box>
          </Page>
        );
      };
  
      export default SettingsPage;
      `
    ).trim();
  }
  return indent(
    0,
    `
    import React from "react";
    import {
      Page,
      List,
      ListItem,
      useStore,
      Title,
      Box
    } from "zmp-framework/react";
    import UserCard from "../components/user-card";

    const SettingsPage = () => {
      const user = useStore("user");

      return (
        <Page name="settings">
          <Box m="0" p="4">
            <Title>Settings</Title>
            <List className="m-0">
              <ListItem link="/user/">
                <UserCard user={user} />
              </ListItem>
            </List>
          </Box>
        </Page>
      );
    };

    export default SettingsPage;
  `
  ).trim();
};
