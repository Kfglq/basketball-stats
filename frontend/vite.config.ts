import { defineConfig, loadEnv } from 'vite' 
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({mode})=>{
  const env = loadEnv(mode, process.cwd(), '');
  const APP_PROTOCOL = env.VITE_APP_HOST || 'http';
  const APP_HOST = env.VITE_APP_HOST || 'localhost';
  const APP_PORT = parseInt(env.VITE_APP_PORT) || 3000; 
  const APP_ROUTE_PREFIX = env.VITE_APP_ROUTE_PREFIX || '/'; 
  const httpsConfig = APP_PROTOCOL === 'https' 
    ? { https: {} }
    : {};
  const GENERATE_SOURCEMAP = env.GENERATE_SOURCEMAP === 'true'
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    base: APP_ROUTE_PREFIX,
    server: {
      ...httpsConfig,
      host: APP_HOST,
      port: APP_PORT
    },
    build: {
      sourcemap: GENERATE_SOURCEMAP, 
    }
  }
})
