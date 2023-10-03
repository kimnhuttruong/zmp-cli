const indent = require('../utils/indent');
const templateIf = require('../utils/template-if');

module.exports = (options) => {
  const { framework, template } = options;

  const productState = `

export const productsState = atom({
  key: "products",
  default: [
    {
      id: '1',
      title: 'Apple iPhone 8',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
    },
    {
      id: '2',
      title: 'Apple iPhone 8 Plus',
      description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
    },
    {
      id: '3',
      title: 'Apple iPhone X',
      description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
    },
  ]
});`;

  if (framework === 'react-typescript') {
    return `
import { atom } from "recoil";
import { userInfo } from 'zmp-sdk';

export const userState = atom<userInfo>({
  key: "user",
  default: {
    id: '12345678',
    name: 'Zalo',
    avatar: 'ZA',
  }
})
${templateIf(template === 'tabs', () => productState)}`;
  }
  return `import { atom } from "recoil";

export const userState = atom({
  key: "user",
  default: {
    id: '12345678',
    name: 'Zalo',
    avatar: 'ZA',
  }
})
${templateIf(template === 'tabs', () => productState)}`;
};
