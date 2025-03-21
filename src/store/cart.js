import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
  }),
  getters: {
    cartItems(state) {
      return state.cart;
    },
    cartTotal(state) {
      return state.cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    },
  },
  actions: {
    addToCart(product) {
      const item = this.cart.find((item) => item.id === product.id);
      if (item) {
        item.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(product) {
      const item = this.cart.find((item) => item.id === product.id);
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.cart = this.cart.filter((item) => item.id !== product.id);
      }
    },
  },
});
