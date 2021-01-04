import { defineConfig } from 'umi';
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
export default defineConfig({
  dva: {
    hmr: true,
  },
  // theme: {
  //   '@body-background': 'var(--body-background)',
  // },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', exact: false, component: '@/pages/index' }],
  title: false,
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },
  antd: {},
  ignoreMomentLocale: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/eeeditor/' : '/',
});
