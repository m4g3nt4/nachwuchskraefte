import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; 
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('scale-'),
        },
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});
