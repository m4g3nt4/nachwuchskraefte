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

function changeSort(event: Event): void {
  const selectedValue = event.detail.value;
  const sortOption = sortOptions.value.find((option) => option.value === selectedValue);
  if (!sortOption) return;
  selectedSort.value = sortOption;
}

function selectCategory(event: Event): void {
  let category = event.detail.value;
  selectedCategory.value = category;
  categoryDropdownOpen.value = false;
  fetchProducts(category ?? 'all');
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

async function fetchProducts(category?: string): Promise<void> {
  loading.value = true;
  let url = category && category !== "all" ? 'https://fakestoreapi.com/products/category/' + category : 'https://fakestoreapi.com/products';
  axios
    .get(url)
    .then((response) => {
      products.value = response.data;
    })
    .catch((err: Error) => {
      console.error(err.message);
      return axios.get('/fallbackProducts.json');
    })
    .then((fallbackResponse) => {
      if (fallbackResponse && fallbackResponse.data) {
        if (category && category !== "all") {
          products.value = fallbackResponse.data.filter((product: Product) => product.category === category);
        } else {
          products.value = fallbackResponse.data;
        }
      }
    })
    .catch((fallbackErr: any) => {
      console.error(`Both API and fallback failed: ${fallbackErr.message}`);
    })
    .finally(() => {
      loading.value = false;
    });
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
      return axios.get('/fallbackProducts.json');
    })
    .then((fallbackResponse) => {
      if (fallbackResponse && fallbackResponse.data) {
        const uniqueCategories = new Set(fallbackResponse.data.map((product: Product) => product.category));
        categories.value = Array.from(uniqueCategories);
      }
    })
    .catch((fallbackErr: any) => {
      console.error(`Both API and fallback failed: ${fallbackErr.message}`);
    });
});
</script>





