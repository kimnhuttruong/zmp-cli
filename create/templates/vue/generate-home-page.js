const indent = require('../../utils/indent');

module.exports = (options) => {
  const { name, template } = options;

  return indent(0, `
  <template>
    <zmp-page name="home" :theme-dark="darkMode">
      <Header />
      <zmp-box m="4">
        <zmp-card inset title="Welcome to Zalo Mini App. Let's see what we have here.">
          <p>
            Recommended IDE Setup:
            <a
              href="https://code.visualstudio.com/"
              target="_blank"
              rel="nofollow"
            >VSCode</a> +
            <a
              href="https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar"
              target="_blank"
              rel="nofollow"
            >Volar</a>
          </p>
          <zmp-button @click="openDocs" fill responsive>Documentation</zmp-button>
        </zmp-card>
      </zmp-box>
      <zmp-box m="4">
        <zmp-card inset class="p-0">
          <zmp-box flex justify-content="space-between" align-items="center">
            <zmp-text bold class="mb-0">Example navigation</zmp-text>
            <zmp-link href="/settings" transition="zmp-fade">
              Settings
              <zmp-icon zmp="zi-chevron-right" />
            </zmp-link>
          </zmp-box>
        </zmp-card>
      </zmp-box>
    </zmp-page>
  </template>

  <script setup>
  import { useStore } from 'zmp-vue';
  import api from 'zmp-sdk';
  import Header from "../components/header.vue";

  const openDocs = () => {
    api.openWebview({
      url: 'https://mini.zalo.me'
    });
  };

  const darkMode = useStore('darkMode');
  </script>
  `).trim();
};
