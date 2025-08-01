<<<<<<< HEAD
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  envPrefix: ['VITE_', 'VUE_APP_'], // permitir variables VITE_ y VUE_APP_
=======
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
>>>>>>> qa1
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
  }
<<<<<<< HEAD
});
=======
})

>>>>>>> qa1
