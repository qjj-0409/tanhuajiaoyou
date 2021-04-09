module.exports = {
  root: true,

  extends: '@react-native-community',

  rules: {
    // enable additional rules
    indent: ['error', 2],
    semi: ['error', 'never'],

    // override default options for rules from base configurations
    'comma-dangle': [2, 'never'],
    'no-cond-assign': ['error', 'always'],

    // disable rules from base configurations
    'no-console': 'off',
    'quote-props': 'always'
  }
}
