<template>
  <zmp-page name="catalog">
    <zmp-navbar title="Catalog"></zmp-navbar>
    <zmp-list>
      <zmp-list-item
        v-for="(product) in products"
        :key="product.id"
        :title="product.title"
        :link="`/product/${product.id}/`"
      ></zmp-list-item>
    </zmp-list>
    <zmp-block v-if="products.length === 3">
      <zmp-button fill @click="addProduct">Add Product</zmp-button>
    </zmp-block>
  </zmp-page>
</template>
<script>
  import { useStore } from 'zmp-vue';
  import store from '../store'

  export default {
    setup() {
      const products = useStore('products');

      const addProduct = () => {
        store.dispatch('addProduct', {
          id: '4',
          title: 'Apple iPhone 12',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        });
      }

      return {
        products,
        addProduct,
      };
    }
  };
</script>
