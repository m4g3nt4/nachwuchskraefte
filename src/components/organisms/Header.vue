<template>
  <div class="w-full flex items-center justify-between pl-5 pr-8 py-4 shadow-lg shadow-black/20 border border-black/10 mx-auto rounded-full mb-4">
    <p
      @click="goToProducts"
      class="bg-[#322e2f] py-[0.4rem] px-[1.4rem] rounded-[5rem] cursor-pointer text-[#f7f6f3]"
    >
      MOMO - Shop everything.
    </p>
   
    <div @click="goToCart">
      <scale-notification-badge
        :label="cartTotal" 
        type="icon"
      >
        <scale-icon-action-shopping-cart 
          accessibility-title="shopping-cart" 
          fill="black"
        />
      </scale-notification-badge>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCartStore } from '../../store/cart';
import { computed } from 'vue';

const router = useRouter();

const cartStore = useCartStore();

const cartTotal = computed(() => cartStore.cartItems.length);

function goToProducts(): void {
  router.push('/');
}

function goToCart(): void {
  router.push('/cart');
}
</script>
