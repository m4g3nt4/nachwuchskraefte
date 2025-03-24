<template>
<div class="flex items-center justify-center p-20">
    <div v-if="!loading && product">
      <ProductCard :product="product" :showDetail="true" @add-to-cart="handleAddToCart" />
    </div>
    <div v-else>
      <p class="text-gray-600 text-lg">Loading product...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ProductCard from '../atoms/ProductCard.vue';
import { useCartStore } from 'src/store/cart';

const product = ref(null);
const loading = ref(true);

const route = useRoute();
const productId = route.params.id;

const cartStore = useCartStore();

function handleAddToCart(product: any) {
  cartStore.addToCart(product);
}

onMounted(() => {
  axios
    .get(`https://fakestoreapi.com/products/${productId}`)
    .then(response => {
      product.value = response.data;
    })
    .catch(err => {
      console.error(err.message);
      return axios.get('/fallbackProducts.json');
    })
    .then((fallbackResponse) => {
        if (fallbackResponse && fallbackResponse.data) {
            product.value = fallbackResponse.data.find((product: Product) => `${product.id}` === productId);
        }
    })
    .catch((fallbackErr: any) => {
        console.error(`Both API and fallback failed: ${fallbackErr.message}`);
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>


  