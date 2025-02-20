<template>
    <div class="p-14">
      <ul v-if="cartItems.length">
        <li
          v-for="item in cartItems"
          :key="item.id"
          class="flex items-center p-6 bg-white mb-2"
        >
          <img
            :src="item.image"
            alt="Product Image"
            class="w-20 object-contain mr-4"
          />
          <div class="flex flex-col">
            <div class="font-bold">{{ item.title }}</div>
            <div>
              ${{ item.price }} x {{ item.quantity }}
            </div>
          </div>
        </li>
      </ul>
      <p v-else>Your cart is empty.</p>
      <div v-if="cartItems.length" class="mt-16 font-bold">
        Total: ${{ cartTotal.toFixed(2) }}
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from 'src/store/cart';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);
</script>
  

  
