angular.module("codeApp", []).controller("MainCtrl", function ($scope, $http) {
  $scope.code = `function teste(a) {
  if (a > 10) {
    console.log("alto");
  } else {
    console.log("baixo");
  }
}`;

  $scope.result = null;
  $scope.problemCategories = [];

  let editor;

  const initEditor = function () {
    editor = CodeMirror(document.getElementById("editor"), {
      value: $scope.code,
      mode: "javascript",
      theme: "material-darker",
      lineNumbers: true,
      indentUnit: 2,
      lineWrapping: true,
      autofocus: true,
      matchBrackets: true,
    });

    editor.on("change", () => {
      $scope.$applyAsync(() => {
        $scope.code = editor.getValue();
      });
    });
  };

  const categorizeIssues = function (issues) {
    const categories = {
      errors: { label: "Erros", items: [] },
      warnings: { label: "Avisos", items: [] },
      es6: { label: "ES6 / Modernização", items: [] },
      possibleBug: { label: "Possível bug", items: [] },
      style: { label: "Estilo e legibilidade", items: [] },
      other: { label: "Outros", items: [] },
    };

    const es6Rules = new Set([
      "no-var",
      "prefer-const",
      "prefer-template",
      "prefer-arrow-callback",
      "prefer-rest-params",
      "no-duplicate-imports",
      "arrow-body-style",
      "no-useless-concat",
    ]);

    issues.forEach((issue) => {
      const entry = {
        ruleId: issue.ruleId || "syntax",
        message: issue.message || "Problema desconhecido",
        line: issue.line || 0,
        column: issue.column || 0,
        severity: issue.severityLabel || (issue.severity === 2 ? "error" : "warning"),
      };

      if (entry.ruleId === "syntax") {
        categories.errors.items.push(entry);
        return;
      }

      if (es6Rules.has(entry.ruleId)) {
        categories.es6.items.push(entry);
        return;
      }

      if (
        entry.ruleId === "no-undef" ||
        entry.ruleId === "no-redeclare" ||
        entry.ruleId === "no-unreachable" ||
        entry.ruleId === "no-unsafe-finally" ||
        entry.ruleId === "no-fallthrough"
      ) {
        categories.possibleBug.items.push(entry);
        return;
      }

      if (
        entry.ruleId === "eqeqeq" ||
        entry.ruleId === "no-extra-semi" ||
        entry.ruleId === "no-unused-vars" ||
        entry.ruleId === "no-console"
      ) {
        categories.style.items.push(entry);
        return;
      }

      if (entry.severity === "error") {
        categories.errors.items.push(entry);
      } else {
        categories.warnings.items.push(entry);
      }
    });

    return Object.values(categories).filter((category) => category.items.length > 0);
  };

  const buildHealthBars = function (result) {
    const normalize = (value, max) => Math.round(Math.max(0, Math.min(100, (value / max) * 100)));
    return [
      {
        label: "Score geral",
        width: result.score,
        color: result.score >= 90 ? "#2ea043" : result.score >= 75 ? "#d29922" : "#d75f00",
        display: result.score + "%",
      },
      {
        label: "Complexidade ciclomática",
        width: normalize(Math.max(0, 20 - result.metrics.complexity), 20),
        color: result.metrics.complexity <= 10 ? "#58a6ff" : "#d75f00",
        display: result.metrics.complexity,
      },
      {
        label: "Profundidade máxima",
        width: normalize(Math.max(0, 10 - result.metrics.maxDepth), 10),
        color: result.metrics.maxDepth <= 4 ? "#58a6ff" : "#d75f00",
        display: result.metrics.maxDepth,
      },
      {
        label: "Funções longas",
        width: normalize(Math.max(0, 6 - result.metrics.longFunctions), 6),
        color: result.metrics.longFunctions <= 1 ? "#58a6ff" : "#d75f00",
        display: result.metrics.longFunctions,
      },
      {
        label: "Adoção ES6",
        width: normalize(Math.max(0, 10 - result.metrics.es6Issues), 10),
        color: result.metrics.es6Issues <= 2 ? "#58a6ff" : "#d75f00",
        display: result.metrics.es6Issues + " issue(s)",
      },
    ];
  };

  const buildSeverityBars = function (issues) {
    const counts = issues.reduce(
      (acc, issue) => {
        acc[issue.severityLabel] = (acc[issue.severityLabel] || 0) + 1;
        return acc;
      },
      { error: 0, warning: 0 },
    );
    const max = Math.max(counts.error, counts.warning, 1);
    return [
      {
        label: "Erros",
        value: counts.error,
        width: Math.round((counts.error / max) * 100),
        color: "#ff4d4f",
      },
      {
        label: "Avisos",
        value: counts.warning,
        width: Math.round((counts.warning / max) * 100),
        color: "#f5d442",
      },
    ];
  };

  const buildCategoryBars = function (issues) {
    const counts = issues.reduce((acc, issue) => {
      const label = issue.category || "Outros";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    const maxCount = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      width: Math.round((value / maxCount) * 100),
      color: label === "Bug" ? "#ff4d4f" : label === "ES6" ? "#58a6ff" : label === "Estilo" ? "#8b949e" : "#c9d1d9",
    }));
  };

  const formatMetric = function (key, value) {
    const map = {
      lintErrors: "Erros ESLint",
      lintWarnings: "Avisos ESLint",
      totalIssues: "Total de problemas",
      es6Issues: "Problemas ES6",
      complexity: "Complexidade",
      maxDepth: "Profundidade máxima",
      totalFunctions: "Total de funções",
      longFunctions: "Funções longas",
      functionsWithManyParams: "Funções com muitos parâmetros",
      duplicates: "Linhas duplicadas",
    };
    return map[key] || key;
  };

  $scope.analyze = function () {
    const apiUrl = "http://localhost:3000/analyze";

    $http
      .post(apiUrl, {
        code: $scope.code,
      })
      .then(function (res) {
        $scope.result = res.data;
        $scope.problemCategories = categorizeIssues(res.data.issues || []);
        $scope.metricEntries = Object.entries(res.data.metrics || {}).map(([key, value]) => ({
          label: formatMetric(key, value),
          value,
        }));
        $scope.healthBars = buildHealthBars(res.data);
        $scope.severityBars = buildSeverityBars(res.data.issues || []);
        $scope.categoryBars = buildCategoryBars(res.data.issues || []);
        $scope.recommendations = res.data.recommendations || [];
        $scope.functionDetails = (res.data.details?.functions || []).map((fn) => ({
          name: fn.name,
          line: fn.line,
          lines: fn.lines,
          params: fn.params,
          isLong: fn.lines > 30,
          manyParams: fn.params > 3,
        }));
        $scope.duplicateLines = res.data.details?.duplicateLines || [];
      })
      .catch(function (err) {
        console.error(err);
        alert("Erro ao analisar");
      });
  };

  window.addEventListener("load", initEditor);
});
