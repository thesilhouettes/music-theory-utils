module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "space-function-before-paren": ["off"],
    "comma-dangle": ["warn", "only-multiline"],
    "no-unreachable": ["error"],
    // I will change the structure of TwoWayMap later
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};
