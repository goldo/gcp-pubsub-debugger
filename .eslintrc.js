module.exports = {
  plugins: ['node'],
  extends: [
    'prettier',
    'prettier/standard',
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  rules: {
    'node/exports-style': ['error', 'module.exports'],
    'no-console': 'off'
  },
  env: { es6: true },
  parserOptions: {
    ecmaVersion: 2018
  }
};
