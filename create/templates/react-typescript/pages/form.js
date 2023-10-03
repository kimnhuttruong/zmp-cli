const indent = require('../../../utils/indent');

module.exports = (options) => {
  const { template } = options;
  const hideNavBar =
    template === 'tabs'
      ? `onPageBeforeIn={()=>{
      //hide navbar
      zmp.toolbar.hide('#app-tab-bar')
    }}`
      : '';

  if (options.stateManagement === 'recoil') {
    return indent(
      0,
      `
      import React from 'react';
      import { Button, Card, Input, Page, Box, zmp } from 'zmp-framework/react';
      import { useRecoilState } from 'recoil';
      import { userState } from '../state';
      import NavbarBack from '../components/navbar-back';

      const FormPage = () => {
        const [user, setUser] = useRecoilState(userState)

        const [form, setForm] = React.useState({ ...user });
        const toast = React.useRef<any>(null)

        const handleChangeInput = (field, value) => {
          setForm({ ...form, [field]: value })
        }

        const handleSubmit = () => {
          if (!toast.current) {
            toast.current = zmp.toast.create({
              text: 'Saved',
              position: 'bottom',
              closeTimeout: 2000,
            })
          }
          setUser(form);
          toast.current.open()
        }

        return (
          <Page 
            name="user-form" 
            ${hideNavBar}
          >
            <NavbarBack title="Update user info" />
            <Box>
              <Card inset>
                <Input
                  id="name"
                  label="Name"
                  type="text"
                  placeholder="Zalo"
                  value={form?.name}
                  onChange={(e) => handleChangeInput('name', e.target.value)}
                />
                <Input
                  label="Avatar"
                  type="text"
                  placeholder="zalo@zalo.me"
                  value={form?.avatar}
                  onChange={(e) => handleChangeInput('avatar', e.target.value)}
                />
                <Box mx="0" mt="4">
                  <Button responsive typeName="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </Box>
              </Card>
            </Box>
          </Page>
        )
      }

      export default FormPage;
      `
    ).trim();
  }

  return indent(
    0,
    `
    import React from 'react';
    import { Button, Card, Input, Page, useStore, zmp, Box } from 'zmp-framework/react';
    import NavbarBack from '../components/navbar-back';

    import store from '../store'

    const FormPage = () => {
      const user = useStore('user')

      const [form, setForm] = React.useState({ ...user });
      const toast = React.useRef<any>(null)

      const handleChangeInput = (field, value) => {
        setForm({ ...form, [field]: value })
      }

      const handleSubmit = () => {
        if (!toast.current) {
          toast.current = zmp.toast.create({
            text: 'Saved',
            position: 'bottom',
            closeTimeout: 2000,
          })
        }
        store.dispatch('setUser', form)
        toast.current.open()
      }

      return (
        <Page 
          name="user-form" 
          ${hideNavBar}
        >
          <NavbarBack title="Update user info" />
          <Box>
            <Card inset>
              <Input
                id="name"
                label="Name"
                type="text"
                placeholder="Zalo"
                value={form?.name}
                onChange={(e) => handleChangeInput('name', e.target.value)}
              />
              <Input
                label="Avatar"
                type="text"
                placeholder="zalo@zalo.me"
                value={form?.avatar}
                onChange={(e) => handleChangeInput('avatar', e.target.value)}
              />
              <Box mx="0" mt="4">
                <Button responsive typeName="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            </Card>
          </Box>
        </Page>
      )
    }

    export default FormPage;
  `
  ).trim();
};
