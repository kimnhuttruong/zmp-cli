const indent = require('../../utils/indent');
const templateIf = require('../../utils/template-if');
const appParameters = require('../app-parameters');

module.exports = (options) => {
  const { template, type, theming, customBuild } = options;

  return indent(0,
    `
    <template>
      <zmp-app v-bind="zmpparams">
        <!-- Your main view, should have "view-main" class -->
        <zmp-view main class="safe-areas" url="/"></zmp-view>
      </zmp-app>
    </template>
    <script>
    import { onMounted } from 'vue';
    import { zmpready } from 'zmp-vue';
    import api from 'zmp-sdk';
    import store from '../store';

    export default {
      setup() {
        // ZMP Parameters
        const zmpparams = {
          ${indent(6, appParameters(options)).trim()}
        };

        onMounted(() => {
          zmpready(async () => {
            // Call ZMP APIs here
            try {
              await api.login();
              const { userInfo } = await api.getUserInfo();
              store.dispatch('setUser', userInfo);
            } catch (error) {
              console.error(error);
            }
          });
        });

        return {
          zmpparams
        }
      }
    }
    </script>
  `
  ).trim();
};
