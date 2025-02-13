<template>
    <div class="product-detail" v-if="!loading && product">
      <ProductCard :product="product" />
    </div>
    <div v-else>
      <p>Loading product...</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import ProductCard from '../atoms/ProductCard.vue';
  
  export default {
    name: 'ProductDetail',
    components: {
      ProductCard,
    },
    data() {
      return {
        product: null,
        loading: true,
        error: null,
      };
    },
    mounted() {
      const productId = this.$route.params.id;
      axios.get(`https://fakestoreapi.com/products/${productId}`)
        .then(response => {
          this.product = response.data;
        })
        .catch(error => {
          this.error = error.message;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  };
  </script>
  
  <style scoped>
  .product-detail {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5rem;
  }
  </style>
  