# Code Health Tool (V2)

`Code Health Tool` é um analisador técnico de código JavaScript moderno, projetado para oferecer um diagnóstico rápido e assertivo sobre a saúde do seu código.

## ✨ Características

- **Análise Assertiva**: Algoritmo rigoroso que penaliza complexidade ciclomática elevada, aninhamento profundo e funções extensas.
- **Editor Premium**: Integração com o **Monaco Editor** (o motor do VSCode) com suporte a temas e syntax highlighting.
- **Feedback em Tempo Real**: Erros e avisos de análise são refletidos diretamente no editor através de "markers" (sublinhados e ícones laterais).
- **Métricas Detalhadas**:
  - Score Geral de Saúde.
  - Manutenibilidade, Complexidade, Legibilidade e Duplicação.
  - Lista completa de funções com linhas, parâmetros e nível de aninhamento.
  - Recomendações acionáveis.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 18, TailwindCSS.
- **Editor**: `@monaco-editor/react`.
- **Análise**:
  - `espree`: Parsing de AST (ESTree).
  - `eslint`: Lógica de linting e regras de melhor prática.
  - `typhonjs-escomplex`: Cálculo de complexidade ciclomática.
- **Backend**: Next.js API Routes (Serverless).

## 🏗️ Arquitetura do Analisador

A análise é processada através de um **Pipeline de Estágios** localizado em `lib/analyzer`:

1.  **Parser Stage**: Converte o código bruto em uma Árvore de Sintaxe Abstrata (AST) compatível com ESTree.
2.  **Lint Stage**: Executa regras do ESLint para identificar problemas de padrão e segurança.
3.  **Complexity Stage**: Calcula a complexidade ciclomática global e por função.
4.  **AST Stage**: Mapeia métricas detalhadas das funções (parâmetros, linhas, aninhamento).
5.  **Duplication Stage**: Identifica blocos de código duplicados.
6.  **Score Stage**: Consolida todas as métricas em uma nota técnica (0-100).
7.  **Recommendation Stage**: Gera sugestões automáticas baseadas nos pontos fracos detectados.

## 🚀 Como Executar

### 1. Instalação
Certifique-se de ter o Node.js v18+ instalado.

```bash
npm install
```

### 2. Desenvolvimento
Inicie o servidor de desenvolvimento do Next.js:

```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`.

### 3. CLI (Opcional)
Você também pode rodar a análise via terminal se o binário estiver configurado:

```bash
node bin/code-health.js <caminho-do-arquivo>
```

## 📝 Observações

- **Hydration Support**: O projeto está otimizado para Next.js 15, tratando corretamente as inconsistências de renderização causadas por extensões de browser.
- **Stricter Mode**: Se o seu código receber um score baixo, é porque o analisador agora prioriza padrões de "Clean Code" e penaliza severamente funções que fogem do padrão de SRP (Single Responsibility Principle).

---
© 2026 Code Health Tool. Inspirado por SonarQube, Linear e Vercel.
