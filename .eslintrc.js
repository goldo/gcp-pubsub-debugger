module.exports = {
  extends: [
    'eslint:recommended',
    'standard',
    'plugin:react/recommended',
    'prettier',
    'prettier/react',
    'prettier/standard'
  ],
  plugins: [
    'react', 'prettier', 'standard'
  ],
  parserOptions: {
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  env: {
    'es6': true,
    'node': true
  },
  rules: {
    'prettier/prettier': 'error'
  }
}