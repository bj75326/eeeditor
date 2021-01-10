import { defineConfig } from 'umi';

export default defineConfig({
  dva: {
    hmr: true,
  },
  //antd: {},
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
