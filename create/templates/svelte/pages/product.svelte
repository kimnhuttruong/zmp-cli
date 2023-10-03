<Page name="product">
  <Navbar title={currentProduct.title} backLink="Back" />
  <BlockTitle>About {currentProduct.title}</BlockTitle>
  <Block strong>
    {currentProduct.description}
  </Block>
</Page>
<script>
  import { Page, Navbar, BlockTitle, Block, useStore } from 'zmp-svelte';

  export let zmproute;

  const products = useStore('products');
  const productId = zmproute.params.id;
  let currentProduct;
  products.forEach(function (product) {
    if (product.id === productId) {
      currentProduct = product;
    }
  });
</script>
