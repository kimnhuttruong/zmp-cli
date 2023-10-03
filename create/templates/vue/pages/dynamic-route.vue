<template>
  <zmp-page>
    <zmp-navbar title="Dynamic Route" back-link="Back"></zmp-navbar>
    <zmp-block strong>
      <ul>
        <li><b>Url:</b> {{zmproute.url}}</li>
        <li><b>Path:</b> {{zmproute.path}}</li>
        <li><b>Hash:</b> {{zmproute.hash}}</li>
        <li><b>Params:</b>
          <ul>
            <li v-for="(value, key) in zmproute.params" :key="key"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Query:</b>
          <ul>
            <li v-for="(value, key) in zmproute.query" :key="key"><b>{{key}}:</b> {{value}}</li>
          </ul>
        </li>
        <li><b>Route:</b> {{zmproute.route.path}}</li>
      </ul>
    </zmp-block>
    <zmp-block strong>
      <zmp-link @click="zmprouter.back()">Go back via Router API</zmp-link>
    </zmp-block>
  </zmp-page>
</template>
<script>
  export default {
    props: {
      zmproute: Object,
      zmprouter: Object,
    },
  };
</script>
