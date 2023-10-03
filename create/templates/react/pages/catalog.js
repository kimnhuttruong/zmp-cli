const indent = require('../../../utils/indent');

// eslint-disable-next-line no-unused-vars
module.exports = (options) => {
  if (options.stateManagement === 'recoil') {
    return indent(
      0,
      `
      import React from "react";
      import { useRecoilState } from 'recoil';
      import { Page, Title, List, ListItem, Box, Button } from 'zmp-framework/react';
      import { productsState } from '../state';
      
      const CatalogPage = () => {
        const [products, setProducts] = useRecoilState(productsState)

        const addProduct = () => {
          setProducts(p => [
            ...p,
            {
              id: '4',
              title: 'Apple iPhone 12',
              description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
            }
          ])
        }
        
        return (
          <Page name="catalog">
            <Box m="0" p="4">
              <Title>Catalog</Title>
              <List>
                {products.map((product) => (
                  <ListItem
                    key={product.id}
                    title={product.title}
                    link={\`/product/\${product.id}/\`}
                  />
                ))}
              </List>
              {products.length === 3 && (
                <Box>
                  <Button responsive typeName="secondary" onClick={addProduct}>
                    Add Product
                  </Button>
                </Box>
              )}
            </Box>
          </Page>
        );
      };
  
      export default CatalogPage;
    `
    ).trim();
  }
  return indent(
    0,
    `
    import React from "react";
    import {
      Page,
      Title,
      List,
      ListItem,
      Box,
      Button,
      useStore
    } from "zmp-framework/react";
    import store from "../store";

    const CatalogPage = () => {
      const products = useStore("products");

      const addProduct = () => {
        store.dispatch("addProduct", {
          id: "4",
          title: "Apple iPhone 12",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis."
        });
      };

      return (
        <Page name="catalog">
          <Box m="0" p="4">
            <Title>Catalog</Title>
            <List>
              {products.map((product) => (
                <ListItem
                  key={product.id}
                  title={product.title}
                  link={\`/product/\${product.id}/\`}
                />
              ))}
            </List>
            {products.length === 3 && (
              <Box>
                <Button responsive typeName="secondary" onClick={addProduct}>
                  Add Product
                </Button>
              </Box>
            )}
          </Box>
        </Page>
      );
    };

    export default CatalogPage;
  `
  ).trim();
};
