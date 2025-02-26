<template>
  <div>
    <!-- Container for Sorting and Category Filters -->
    <div class="flex gap-4 mb-4 text-sm">
      <div class="relative">
        <scale-button
          variant="secondary"
          @click="toggleCategoryDropdown"
          class="cursor-pointer flex items-center"
        >
          <span>Category: {{ selectedCategory ? capitalize(selectedCategory) : 'All' }}</span>
          <svg
            class="ml-3 transition-transform duration-200"
            :class="{ 'rotate-180': categoryDropdownOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="14"
            height="14"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </scale-button>
      
        <ul
          v-if="categoryDropdownOpen"
          class="absolute left-0 mt-2 w-48 z-50 bg-white border border-gray-300 shadow-lg rounded-md"
        >
          <li
            @click="selectCategory(null)"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100"
            :class="{ 'bg-gray-200': selectedCategory === null }"
          >
            All
          </li>
          <li
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100"
            :class="{ 'bg-gray-200': selectedCategory === category }"
          >
            {{ capitalize(category) }}
          </li>
        </ul>
      </div>

      <!-- Sorting Dropdown: lets users sort the list of products -->
      <div class="relative">
        <scale-button
          variant="secondary"
          @click="toggleDropdown"
          class="cursor-pointer flex items-center"
        >
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
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </scale-button>
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
    </div>

    <div
      v-if="!loading && sortedProducts.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <!-- Render a ProductCard for each product in the sorted list -->
      <ProductCard
        v-for="product in sortedProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>
    <!-- Fallback message displayed while products are being fetched -->
    <p v-else class="text-center text-gray-500">Loading products...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '../atoms/ProductCard.vue';
import { useCartStore } from 'src/store/cart';

interface Product {
  id: number | string;
  title: string;
  price: number;
  image?: string;
}

interface SortOption {
  label: string;
  value: string;
}

const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const sortOptions = ref<SortOption[]>([
  { label: "A → Z", value: "alpha-asc" },
  { label: "Z → A", value: "alpha-desc" },
]);

const selectedSort = ref<SortOption>({ label: "A → Z", value: "alpha-asc" });
const selectedCategory = ref<string | null>(null);

const dropdownOpen = ref<boolean>(false);
const categoryDropdownOpen = ref<boolean>(false);

function toggleDropdown(): void {
  dropdownOpen.value = !dropdownOpen.value;
}

function toggleCategoryDropdown(): void {
  categoryDropdownOpen.value = !categoryDropdownOpen.value;
}

function changeSort(option: SortOption): void {
  selectedSort.value = option;
  dropdownOpen.value = false;
}

function selectCategory(category: string | null): void {
  selectedCategory.value = category;
  categoryDropdownOpen.value = false;
  fetchProducts(category ?? 'All');
}

function addToCart(product: Product): void {
  const cartStore = useCartStore();
  cartStore.addToCart(product);
}

const sortedProducts = computed(() => {
  let items = [...products.value];
  switch (selectedSort.value.value) {
    case "alpha-asc":
      return items.sort((a, b) => a.title.localeCompare(b.title));
    case "alpha-desc":
      return items.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return items;
  }
});

async function fetchProducts(): Promise<void> {
  loading.value = true;
  let url = 'https://fakestoreapi.com/products';
  try {
    const response = await axios.get(url);
    products.value = response.data;
  } catch (err: any) {
    error.value = err.message;
    try {
      const fallbackResponse = await axios.get('/fallbackProducts.json');
      products.value = fallbackResponse.data;
    } catch (fallbackErr: any) {
      error.value = `Both API and fallback failed: ${fallbackErr.message}`;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchProducts();
  axios
    .get('https://fakestoreapi.com/products/categories')
    .then((response) => {
      categories.value = response.data;
    })
    .catch((err: Error) => {
      console.error(err.message);
    });
});
</script>





