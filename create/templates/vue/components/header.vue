<template>
  <zmp-navbar>
    <zmp-nav-left>
      <zmp-skeleton-avatar v-if="!user.id" class="pt-2"></zmp-skeleton-avatar>
      <zmp-avatar v-else :src="user.avatar" online />
    </zmp-nav-left>
    <zmp-nav-title v-if="!user.id">
      <zmp-skeleton-text>
        <zmp-title class="mb-0">Lorem ipsum</zmp-title>
      </zmp-skeleton-text>
      <zmp-skeleton-text>Lorem ipsum</zmp-skeleton-text>
    </zmp-nav-title>
    <zmp-nav-title v-else>
      <zmp-title class="mb-0">{{ user.name }}</zmp-title>
      <zmp-text class="mb-0">{{ user.id }}</zmp-text>
    </zmp-nav-title>
    <zmp-nav-right>
      <sun-and-moon />
    </zmp-nav-right>
  </zmp-navbar>
</template>

<script setup>
import { useStore } from "zmp-vue";
import SunAndMoon from "./sun-and-moon.vue";

const user = useStore('user')
</script>