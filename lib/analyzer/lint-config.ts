export function getLintConfig() {
  return {
    env: { browser: true, node: true, es2021: true },
    parserOptions: { ecmaVersion: 2021 as const, sourceType: "module" as const },
    rules: {
      // 🚨 ERROS CRÍTICOS (Bugs e Segurança)
      "no-unused-vars": ["error", { vars: "all", args: "after-used", ignoreRestSiblings: true }],
      "no-undef": "error",
      "no-redeclare": "error",
      "no-const-assign": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-case": "error",
      "no-func-assign": "error",
      "no-import-assign": "error",
      "no-obj-calls": "error",
      "no-setter-return": "error",
      "no-sparse-arrays": "error",
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "no-unsafe-optional-chaining": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",
      "no-self-compare": "error",
      "no-sequences": "error",
      "no-shadow": "error",
      "no-use-before-define": ["error", { functions: false, classes: true, variables: true }],
      "array-callback-return": "error",
      
      // 🚩 MELHORES PRÁTICAS (Lógica)
      eqeqeq: ["error", "always"],
      "no-extra-semi": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-template": "warn",
      "no-console": "warn",
      "no-empty": "warn",
      "no-else-return": "warn",
      "no-lone-blocks": "warn",
      "no-multi-assign": "error",
      "no-nested-ternary": "error",
      
      // 📏 MÉTRICAS DE COMPLEXIDADE
      "max-params": ["error", 3], // Mais rigoroso (máximo 3)
      "max-depth": ["error", 3],  // Mais rigoroso (máximo 3)
      "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
      complexity: ["error", { max: 10 }],
      
      // 🚀 ES6+
      "prefer-arrow-callback": "warn",
      "prefer-rest-params": "warn",
      "no-duplicate-imports": "error",
      "no-useless-concat": "warn",
      "no-useless-return": "warn",
      "arrow-body-style": ["warn", "as-needed"],
    },
  };
}
