module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["airbnb", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".js", ".jsx"],
      },
    ],
    "react/jsx-props-no-spreading": "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  overrides: [
    {
      files: ["server/**"],
      rules: {
        "no-console": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};
