export default {
  //entry: 'src/component/eeeditor/index.tsx',
  cjs: 'babel',
  esm: { type: 'babel', importLibToEs: true },
  //doc: { base: '/eeeditor' },
  preCommit: {
    eslint: true,
    prettier: true,
  },
  runtimeHelpers: true,
};
