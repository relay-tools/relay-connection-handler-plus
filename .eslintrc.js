module.exports = {
  extends: ['4catalyzer', '4catalyzer-typescript', 'prettier'],
  plugins: ['prettier'],
  env: {
    browser: true,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
