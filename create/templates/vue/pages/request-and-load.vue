<template>
  <zmp-page>
    <zmp-navbar :title="`${user.firstName} ${user.lastName}`" back-link="Back"></zmp-navbar>
    <zmp-block strong>
      {{user.about}}
    </zmp-block>
    <zmp-list>
      <zmp-list-item
        v-for="(link, index) in user.links"
        :key="index"
        :link="link.url"
        :title="link.title"
        external
        target="_blank"
      ></zmp-list-item>
    </zmp-list>
  </zmp-page>
</template>
<script>
  export default {
    props: {
      user: Object,
    }
  }
</script>
