<template>
    <div>
        <scale-data-grid v-if="cartItems.length" id="shoppingCart" hide-menu numbered></scale-data-grid>
        <p v-else style="color: black;">Your cart is empty.</p>
        <div v-if="cartItems.length" class="mt-16 font-bold" style="color: black;">
            Total: ${{ cartTotal.toFixed(2) }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useCartStore } from '../../store/cart';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartTotal = computed(() => cartStore.cartTotal);

const fields = [
    { type: 'text', label: 'Name' },
    { type: 'number', label: 'Quantity' },
    { type: 'number', label: 'Price', prefix: '$' },
    { type: 'actions', label: 'Actions' },
];
const rows = computed(() =>
    cartItems.value.map(item => [
        item.title,
        item.quantity,
        item.price,
        [{ label: 'Delete', variant: 'secondary', onClick: () => cartStore.removeFromCart(item), }]
    ])
);

const loadTableData = () => {
    const table = document.querySelector('#shoppingCart');
    table.fields = fields;
    table.rows = rows.value;
}

onMounted(() => {
    if (cartItems.value.length) {
        loadTableData();
    }
});

watch(rows, () => {
    if (cartItems.value.length) {
        loadTableData();
    }
});
</script>