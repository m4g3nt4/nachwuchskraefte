<template>
  <div
    class="text-[#322e2f] cursor-pointer p-2 text-center relative bg-white"
    @click="goToDetail"
  >
    <div class="w-full h-[300px] flex items-center justify-center overflow-hidden mb-2 relative">
      <img
        :src="product.image"
        alt="Product Image"
        class="max-w-full max-h-full object-contain"
      />
      <button
        class="absolute p-[0.4rem] flex items-center justify-center rounded-full cursor-pointer bg-[#ffffffa6] z-[10000] hover:bg-[#ffffffbd]"
        :style="buttonStyle"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click.stop="handleAddToCart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none">
          <path :d="currentPath" fill="black" fill-opacity="1" />
        </svg>
      </button>
    </div>
    <h2 class="leading-[1rem] text-[0.8rem] mb-[0.3rem] text-left">
      {{ product.title }}
    </h2>
    <p class="text-base text-left">${{ product.price }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface Product {
  id: number | string;
  image: string;
  title: string;
  price: number;
}

export default defineComponent({
  name: 'ProductCard',
  props: {
    product: {
      type: Object as () => Product,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter();

    const originalPath =
      "M16.4591 5.4C16.3991 4.84 15.9291 4.41 15.3691 4.41H12.9191V3.93C12.9091 1.76 11.1491 0 8.97913 0C6.81913 0 5.05913 1.76 5.05913 3.93V4.42H2.59913C2.02913 4.42 1.55913 4.84 1.50913 5.41L0.0091297 19.8C-0.0208703 20.11 0.0791297 20.42 0.28913 20.65C0.48913 20.87 0.78913 21 1.09913 21H16.8691C17.1791 21 17.4791 20.87 17.6891 20.64C17.8991 20.41 17.9991 20.1 17.9691 19.79L16.4591 5.4ZM6.24913 3.93C6.24913 2.43 7.46913 1.2 8.97913 1.2C10.4791 1.2 11.7091 2.42 11.7091 3.93V4.42H6.24913V3.93ZM1.20913 19.8L2.68913 5.62H5.04913V8.58H6.24913V5.62H11.7091V8.58H12.9091V5.62H15.2691L16.7491 19.81H1.20913V19.8Z";
    const newPath =
      "M16.4591 5.4C16.3991 4.84 15.9291 4.41 15.3691 4.41H12.9191V3.93C12.9091 1.76 11.1491 0 8.97913 0C6.81913 0 5.05913 1.76 5.05913 3.93V4.42H2.59913C2.02913 4.42 1.55913 4.84 1.50913 5.41L0.0091297 19.8C-0.0208703 20.11 0.0791297 20.42 0.28913 20.65C0.48913 20.87 0.78913 21 1.09913 21H16.8691C17.1791 21 17.4791 20.87 17.6891 20.64C17.8991 20.41 17.9991 20.1 17.9691 19.79L16.4591 5.4ZM6.24913 3.93C6.24913 2.43 7.46913 1.2 8.97913 1.2C10.4791 1.2 11.7091 2.42 11.7091 3.93V4.42H6.24913V3.93ZM1.20913 19.8L2.68913";

    const currentPath = ref(originalPath);

    const isClicked = ref(false);

    const buttonStyle = computed(() => ({
      width: isClicked.value ? '1.8rem' : '1.7rem',
      height: isClicked.value ? '1.8rem' : '1.7rem',
      bottom: isClicked.value ? '0.45rem' : '0.5rem',
      right: isClicked.value ? '0.45rem' : '0.5rem',
      transition: 'all 0.1s ease'
    }));

    const goToDetail = (): void => {
      router.push({ name: 'ProductDetail', params: { id: props.product.id } });
    };

    const handleAddToCart = (): void => {
      emit('add-to-cart', props.product);
      isClicked.value = true;
      setTimeout(() => {
        isClicked.value = false;
      }, 200);
    };

    const handleMouseEnter = (): void => {
      currentPath.value = newPath;
    };

    const handleMouseLeave = (): void => {
      currentPath.value = originalPath;
    };

    return {
      product: props.product,
      goToDetail,
      handleAddToCart,
      handleMouseEnter,
      handleMouseLeave,
      currentPath,
      buttonStyle,
    };
  },
});
</script>








