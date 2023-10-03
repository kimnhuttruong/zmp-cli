const indent = require('../../../utils/indent');
const { projectFramework } = require('../../../../utils/constants')

module.exports = (options) => {
  const { framework } = options;

  if(framework === projectFramework.REACT_TYPESCRIPT){
    return indent(
      0,
      `
  import React from "react";
  import { Avatar, List, Text, Box, Page, Button, Icon, useNavigate } from "zmp-ui";
  import { useRecoilValue } from "recoil";
  import { userState } from "../state";
  import { userInfo } from "zmp-sdk";
  
  const UserPage = () => {
    const user = useRecoilValue<userInfo>(userState);
    const navigate = useNavigate()
    return (
      <Page className="page">
        <Box flex flexDirection="column" justifyContent="center" alignItems="center">
          <Box>
            <Avatar
              story='default'
              size={96}
              online
              src={user.avatar.startsWith("http") ? user.avatar : undefined}
            >
              {user.avatar}
            </Avatar>
          </Box>
          <Box flex flexDirection="row" alignItems="center" ml={8}>
            <Box>
            <Text.Title >{user.name}</Text.Title>
            </Box>
            <Box ml={4}>
              <Button onClick={()=>{navigate('/form')}}  size='small' icon={<Icon icon="zi-edit"/>}/>
            </Box>
          </Box>
        </Box>
        <Box m={0} p={0} mt={4}>
          <div className="section-container">
            <List>
              <List.Item title="Display name" subTitle={user.name} />
              <List.Item title="ID" subTitle={user.id} />
            </List>
          </div>
        </Box>
  
      </Page>
    );
  };
  
  export default UserPage;
    `
    ).trim();
  }

  return indent(
    0,
    `
    import React from "react";
    import { Avatar, List, Text, Box, Page, Button, Icon, useNavigate } from "zmp-ui";
    import { useRecoilValue } from "recoil";
    import { userState } from "../state";

    const UserPage = () => {
      const user = useRecoilValue(userState);
      const navigate = useNavigate()
      return (
        <Page className="page">
          <Box flex flexDirection="column" justifyContent="center" alignItems="center">
            <Box>
              <Avatar
                story
                size={96}
                online
                src={user.avatar.startsWith("http") ? user.avatar : null}
              >
                {user.avatar}
              </Avatar>
            </Box>
            <Box flex flexDirection="row" alignItems="center" ml={8}>
              <Box>
              <Text.Title >{user.name}</Text.Title>
              </Box>
              <Box ml={4}>
                <Button onClick={()=>{navigate('/form')}}  size='small' icon={<Icon icon="zi-edit"/>}/>
              </Box>
            </Box>
          </Box>
          <Box m={0} p={0} mt={4}>
            <div className="section-container">
              <List>
                <List.Item title="Display name" subTitle={user.name} />
                <List.Item title="ID" subTitle={user.id} />
              </List>
            </div>
          </Box>
          
        </Page>
      );
    };

    export default UserPage;
  `
  ).trim();
};
