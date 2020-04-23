module.exports = (api) => ({
  presets: [
    [
      '@4c',
      {
        target: 'web',
        modules: api.env() === 'esm' ? false : 'commonjs',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [api.env() !== 'esm' && 'add-module-exports'].filter(Boolean),
});
