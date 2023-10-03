import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: './',
    base: '',
    plugins: [reactRefresh()],
    css: {
      modules: {
        scopeBehaviour: 'local'
      }
    },
    build: {
      target: 'es2015',
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].module.js',
          chunkFileNames: 'assets/[name].[hash].module.js',
        }
      }
    },
  })
}
