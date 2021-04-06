import { defineConfig } from 'umi';

export default defineConfig({
  dva: {
    hmr: true,
  },
  antd: {},
  theme: {
    '@text-color': 'var(--color-tint-7)',
    '@message-notice-content-bg': 'var(--color-tint-1)',
    '@static-toolbar-bg-color': 'var(--color-inverse)',
    '@buttons-text-disabled-color': 'var(--color-tint-4)',
    '@buttons-hover-bg': 'var(--color-tint-2)',
    '@static-toolbar-separator-color': 'var(--color-tint-6)',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', exact: false, component: '@/pages/index' }],
  title: false,
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },
  ignoreMomentLocale: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/eeeditor/' : '/',
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@icon-park/react',
        libraryDirectory: 'es/icons',
        camel2DashComponentName: false,
      },
    ],
  ],
});
