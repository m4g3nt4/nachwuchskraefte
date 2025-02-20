<template>
  <div class="w-full flex items-center justify-between pl-5 pr-8 py-4 shadow-lg shadow-black/20 border border-black/10 mx-auto rounded-full mb-4">
    <p
      @click="goToProducts"
      class="bg-[#322e2f] py-[0.4rem] px-[1.4rem] rounded-[5rem] cursor-pointer text-[#f7f6f3]"
    >
      MOMO - Shop everything.
    </p>
   

    <svg
      @click="goToCart"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="21"
      viewBox="0 0 18 21"
      fill="none"
      class="cursor-pointer"
    >
      <path
        d="M16.4591 5.4C16.3991 4.84 15.9291 4.41 15.3691 4.41H12.9191V3.93C12.9091 1.76 11.1491 0 8.97913 0C6.81913 0 5.05913 1.76 5.05913 3.93V4.42H2.59913C2.02913 4.42 1.55913 4.84 1.50913 5.41L0.0091297 19.8C-0.0208703 20.11 0.0791297 20.42 0.28913 20.65C0.48913 20.87 0.78913 21 1.09913 21H16.8691C17.1791 21 17.4791 20.87 17.6891 20.64C17.8991 20.41 17.9991 20.1 17.9691 19.79L16.4591 5.4ZM6.24913 3.93C6.24913 2.43 7.46913 1.2 8.97913 1.2C10.4791 1.2 11.7091 2.42 11.7091 3.93V4.42H6.24913V3.93ZM1.20913 19.8L2.68913 5.62H5.04913V8.58H6.24913V5.62H11.7091V8.58H12.9091V5.62H15.2691L16.7491 19.81H1.20913V19.8Z"
        fill="black"
        fill-opacity="0.9"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

function goToProducts(): void {
  router.push('/');
}

function goToCart(): void {
  router.push('/cart');
}

</script>

  
