<template>
  <zmp-page name="product">
    <zmp-navbar :title="product.title" back-link="Back"></zmp-navbar>
    <zmp-block-title>About {{product.title}}</zmp-block-title>
    <zmp-block strong>
      {{product.description}}
    </zmp-block>
  </zmp-page>
</template>
<script>
  import { useStore } from 'zmp-vue';

  export default {
    props: {
      zmproute: Object,
    },
    setup(props) {
      const products = useStore('products');
      const productId = props.zmproute.params.id;
      let currentProduct;
      products.forEach(function (product) {
        if (product.id === productId) {
          currentProduct = product;
        }
      });
      return {
        product: currentProduct,
      };
    },
  };
</script>
