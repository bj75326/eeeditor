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
    '@button-text-disabled-color': 'var(--color-tint-4)',
    '@item-hover-bg': 'var(--color-tint-2)',
    '@static-toolbar-separator-color': 'var(--color-tint-6)',
    '@inline-toolbar-separator-color': 'var(--color-tint-6)',
    '@label-color': 'var(--color-tint-7)',
    '@component-background': 'var(--color-tint-extra-0)',
    '@popover-button-hover-bg': 'var(--color-tint-extra-1)',
    '@inline-toolbar-btn-hover-bg': 'var(--color-tint-extra-1)',
    '@border-color-base': 'var(--color-tint-4)',
    '@input-placeholder-color': 'var(--color-tint-4)',
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
