import { defineConfig } from 'umi';

export default defineConfig({
  dva: {
    hmr: true,
  },
  theme: {
    '@body-background': 'var(--body-background)',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  title: false,
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },
});
