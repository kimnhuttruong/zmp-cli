<template>
  <zmp-button
    small
    class="sun-moon"
    @click="setLayoutTheme"
    type-name="primary"
    round
    :color="darkMode ? 'gray' : 'default'"
  >
    <img :src="icon" alt="switch-mode" />
  </zmp-button>
</template>

<script setup>
import { useStore } from 'zmp-vue';
import { computed } from 'vue';
import store from '../store';
import sun from '../static/icons/sun.svg';
import moon from '../static/icons/moon.svg';

const darkMode = useStore('darkMode');

const icon = computed(() => (darkMode.value ? moon : sun));

const setLayoutTheme = () => {
  store.dispatch('setDarkMode', !darkMode.value);
};
</script>

<style scoped>
.sun-moon {
  padding: 0;
}
</style>