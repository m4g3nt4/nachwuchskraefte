<template>
  <div>
    <div class="relative mb-4 text-sm">
      <button @click="toggleDropdown" class="cursor-pointer flex items-center">
        <span>Sort By: {{ selectedSort.label }}</span>
        <svg 
          class="ml-3 transition-transform duration-200"
          :class="{ 'rotate-180': dropdownOpen }"
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          width="14" 
          height="14"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul
        v-if="dropdownOpen"
        class="absolute left-0 mt-2 w-48 z-50 bg-white border border-gray-300 shadow-lg rounded-md"
      >
        <li 
          v-for="option in sortOptions" 
          :key="option.value" 
          @click="changeSort(option)"
          class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          :class="{ 'bg-gray-200': option.value === selectedSort.value }"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>

    <div v-if="!loading && sortedProducts.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <ProductCard 
        v-for="product in sortedProducts" 
        :key="product.id" 
        :product="product" 
        @add-to-cart="addToCart"
      />
    </div>
    <p v-else class="text-center text-gray-500">Loading products...</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '../atoms/ProductCard.vue';
import { useCartStore } from 'src/store/cart';

interface Product {
  id: number | string;
  title: string;
  price: number;
}

interface SortOption {
  label: string;
  value: string;
}

const products = ref<Product[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const dropdownOpen = ref<boolean>(false);
const sortOptions = ref<SortOption[]>([
  { label: "A → Z", value: "alpha-asc" },
  { label: "Z → A", value: "alpha-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
]);
const selectedSort = ref<SortOption>({ label: "A → Z", value: "alpha-asc" });

onMounted(() => {
  axios
    .get('https://fakestoreapi.com/products')
    .then((response) => {
      products.value = response.data;
    })
    .catch((err: Error) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
});

const sortedProducts = computed(() => {
  const items = [...products.value];
  switch (selectedSort.value.value) {
    case "alpha-asc":
      return items.sort((a, b) => a.title.localeCompare(b.title));
    case "alpha-desc":
      return items.sort((a, b) => b.title.localeCompare(a.title));
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    default:
      return items;
  }
});

function toggleDropdown(): void {
  dropdownOpen.value = !dropdownOpen.value;
}

function changeSort(option: SortOption): void {
  selectedSort.value = option;
  dropdownOpen.value = false;
}

function addToCart(product: Product): void {
  const cartStore = useCartStore();
  cartStore.addToCart(product);
}
</script>

