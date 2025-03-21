<template>
  <div>
    <!-- Container for Sorting and Category Filters -->
    <div class="flex gap-4 mb-4 text-sm">
      <div class="flex">
        <scale-dropdown-select 
          label="Category" 
          value="all" 
          style="min-width: 200px;"
          @scale-change="selectCategory"
        >
          <scale-dropdown-select-item
            value="all"
          >
            All
          </scale-dropdown-select-item>
          <scale-dropdown-select-item
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ capitalize(category) }}
          </scale-dropdown-select-item>
        </scale-dropdown-select>
      </div>

      <!-- Sorting Dropdown: lets users sort the list of products -->
      <div class="relative flex">
        <scale-dropdown-select
          label="Sort By"
          value="alpha-asc"
          style="min-width: 200px;"
          @scale-change="changeSort"
        >
          <scale-dropdown-select-item
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </scale-dropdown-select-item>
        </scale-dropdown-select>
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

const categoryDropdownOpen = ref<boolean>(false);

function changeSort(event): void {
  const selectedValue = event.detail.value;
  const sortOption = sortOptions.value.find((option) => option.value === selectedValue);
  if (!sortOption) return;
  selectedSort.value = sortOption;
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





