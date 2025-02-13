import { createRouter, createWebHistory } from 'vue-router';
import ProductList from 'src/components/organisms/ProductList.vue';
import Cart from '../components/organisms/Cart.vue';
import ProductDetail from '../components/organisms/ProductDetail.vue';

const routes = [
  { path: '/', 
    name: 'Products', 
    component: ProductList },
  { path: '/cart', 
    name: 'Cart', 
    component: Cart },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;