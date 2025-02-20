<template>
  <div>
    <!-- Sorting and Category Filters -->
    <div class="flex gap-4 mb-4 text-sm">
      <!-- Category Dropdown -->
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

        <!-- Dropdown for Categories (Functionality Missing) -->
        <ul
          v-if="categoryDropdownOpen"
          class="absolute left-0 mt-2 w-48 z-50 bg-white border border-gray-300 shadow-lg rounded-md"
        >
          <!-- Placeholder for All Categories Option -->
          <li
            @click="selectCategory(null)"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100"
            :class="{ 'bg-gray-200': selectedCategory === null }"
          >
            All
          </li>

          <!-- Placeholder for Dynamically Fetched Categories -->
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

      <!-- Sorting Dropdown -->
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

        <!-- Sorting Options -->
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

    <!-- Product Cards -->
    <div
      v-if="!loading && sortedProducts.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from '../atoms/ProductCard.vue';

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
const categories = ref<string[]>([]); // Placeholder for categories
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

// Placeholder for selecting a category (To be implemented by applicant)
function selectCategory(category: string | null): void {
  selectedCategory.value = category;
  categoryDropdownOpen.value = false;
  // Intentionally left blank for the applicant to implement
}

// Sorting logic (still functional)
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

// Fetch products (Category filtering left unimplemented intentionally)
function fetchProducts(): void {
  loading.value = true;
  const url = 'https://fakestoreapi.com/products';
  axios
    .get(url)
    .then((response) => {
      products.value = response.data;
    })
    .catch((err: Error) => {
      error.value = err.message;
    })
    .finally(() => {
      loading.value = false;
    });
}

// Initial fetch for products (Categories fetching to be implemented by applicant)
onMounted(() => {
  fetchProducts();
  // categories.value = ['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing']; // Placeholder
});
</script>




