import { defineConfig } from 'umi';

export default defineConfig({
  dva: {
    hmr: true,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
});
