import { ProjectType } from "./types";

export function getLintConfig(type: ProjectType = "javascript") {
  const baseRules = {
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
    "max-params": ["error", 3],
    "max-depth": ["error", 3],
    "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
    complexity: ["error", { max: 10 }],

    // 🚀 ES6+
    "prefer-arrow-callback": "warn",
    "prefer-rest-params": "warn",
    "no-duplicate-imports": "error",
    "no-useless-concat": "warn",
    "no-useless-return": "warn",
    "arrow-body-style": ["warn", "as-needed"],
  };

  const config: any = {
    env: { browser: true, node: true, es2021: true },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      ecmaFeatures: { jsx: type === "react" },
    },
    rules: { ...baseRules },
  };

  if (type === "react") {
    config.rules = {
      ...config.rules,
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
    };
    config.parser = "@typescript-eslint/parser"; // Assume React is TS for better coverage
  } else if (type === "vue") {
    config.parser = "vue-eslint-parser";
    config.rules = {
      ...config.rules,
      "vue/no-unused-vars": "error",
      "vue/require-v-for-key": "error",
      "vue/no-use-v-if-with-v-for": "error",
      "vue/multi-word-component-names": "off",
    };
  } else if (type === "angular") {
    config.parser = "@typescript-eslint/parser";
    config.rules = {
      ...config.rules,
      "@angular-eslint/component-class-suffix": "error",
      "@angular-eslint/directive-class-suffix": "error",
      "@angular-eslint/no-empty-lifecycle-method": "warn",
    };
  } else if (type === "angularjs") {
    config.rules = {
      ...config.rules,
      "angular/controller-as": "error",
      "angular/di": "error",
      "angular/no-private-service": "warn",
    };
  } else if (type === "typescript") {
    config.parser = "@typescript-eslint/parser";
  }

  // Add shared TS rules if a TS parser is used
  if (config.parser === "@typescript-eslint/parser") {
    config.rules = {
      ...config.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    };
  }

  return config;
}
