const { projectFramework } = require('../../../utils/constants');
const indent = require('../../utils/indent');
module.exports = (options) => {
  const { name, template, framework, stateManagement } = options;
  if(framework === projectFramework.REACT_TYPESCRIPT){
    return indent(
      0,
      `
      import React from 'react';
      ${
        template === 'blank'
          ? `
      import { Page } from 'zmp-ui';
      `.trim()
          : `
      import {
        List,
        Page,
        Icon,
        useNavigate
      } from 'zmp-ui';${stateManagement === 'recoil' ? `
      import { useRecoilValue } from 'recoil';
      import { userInfo } from "zmp-sdk";
      import { userState } from '../state';` : ''}
      ${template !=='blank' ?`
      import UserCard from '../components/user-card';
      `:''}
      `.trim()
      }
  
      const HomePage:React.FunctionComponent = () => {
        ${template !== 'blank' ? (stateManagement === 'recoil' ? "const user = useRecoilValue<userInfo>(userState);" : "const user = useStore('user');") : ''}
        ${template !=='blank' ?   `const navigate = useNavigate()`:''}
        return (
          ${template==='blank' ?`<Page className="page">
            Hello Zalo Mini App
          </Page> `.trim():
          `
          <Page  className="page">
          <div className="section-container">
            <UserCard user={user}/> 
          </div>
          <div className="section-container">
          <List >
            <List.Item suffix={<Icon icon="zi-arrow-right"/>}>
              <div  onClick={()=>navigate('/about')}>About</div>
            </List.Item>
            <List.Item suffix={<Icon icon="zi-arrow-right"/>}>
              <div onClick={()=>navigate('/user')}>User</div>
            </List.Item>
          </List>
          </div>
        </Page>`.trim()
        }
        );
      }
      
      export default HomePage;
    `
    ).trim(); 
  }
  return indent(
    0,
    `
    import React from 'react';
    ${
      template === 'blank'
        ? `
    import {
      Page
    } from 'zmp-ui';
    `.trim()
        : `
    import {
      List,
      Page,
      Icon,useNavigate
    } from 'zmp-ui';${stateManagement === 'recoil' ? `
    import { useRecoilValue } from 'recoil';
    import { userState } from '../state';` : ''}
    ${template !=='blank' ?`
    import UserCard from '../components/user-card';
    `:''}
    `.trim()
    }

    const HomePage = () => {
      ${template !== 'blank' ? (stateManagement === 'recoil' ? "const user = useRecoilValue(userState);" : "const user = useStore('user');") : ''}
      ${template !=='blank' ?   `const navigate = useNavigate()`:''}
      return (
        ${template==='blank' ?`<Page className="page">
          Hello Zalo Mini App
        </Page> `.trim():
        `
        <Page className="page">
        <div className="section-container">
          <UserCard user={user}/> 
        </div>
        <div className="section-container">
        <List >
          <List.Item suffix={<Icon icon="zi-arrow-right"/>}>
            <div  onClick={()=>navigate('/about')}>About</div>
          </List.Item>
          <List.Item suffix={<Icon icon="zi-arrow-right"/>}>
            <div onClick={()=>navigate('/user')}>User</div>
          </List.Item>
        </List>
        </div>
      </Page>`.trim()
      }
      );
    }
    
    export default HomePage;
  `
  ).trim();
};
