# Code Health Tool

`Code Health Tool` é uma aplicação simples de análise de código JavaScript que gera métricas, identifica problemas de lint e aponta pontos de atenção na qualidade do código.

## Objetivo

O objetivo do projeto é oferecer uma ferramenta leve e direta para analisar rapidamente um trecho de código JavaScript e apresentar:

- score de qualidade
- principais problemas de lint
- complexidade ciclomática
- profundidade de aninhamento
- funções longas e com muitos parâmetros
- duplicações simples
- recomendações de melhoria

O projeto foi construído como algo simples e direto: ele não busca cobrir todas as regras possíveis, mas sim trazer um diagnóstico rápido e fácil de entender.

## Como funciona

1. O usuário escreve ou cola o seu código JavaScript no editor da interface.
2. Ao clicar em `Analisar`, o frontend envia o código para o backend via requisição HTTP `POST /analyze`.
3. O backend processa o código usando a lógica de análise:
   - lint com ESLint
   - cálculo de complexidade com `typhonjs-escomplex`
   - análise AST para funções, profundidade e duplicações
   - cálculo de score e geração de recomendações
4. O backend devolve um relatório JSON com métricas, issues e recomendações.
5. O frontend exibe o resultado em uma interface organizada com cards, gráficos e listas de problemas.

## Arquitetura

A arquitetura do backend foi organizada para manter responsabilidades separadas e facilitar manutenção:

- `backend/src/server.js`
  - entrada da aplicação e inicialização do servidor Express
- `backend/src/app.js`
  - configuração do app Express, middlewares e roteamento
- `backend/src/routes/analyze.js`
  - rota `POST /analyze` e validação básica da requisição
- `backend/src/analyzer/index.js`
  - orquestra a análise completa do código
- `backend/src/analyzer/lint-config.js`
  - configurações de regras ESLint
- `backend/src/analyzer/lint.js`
  - executa o lint e formata as issues
- `backend/src/analyzer/complexity.js`
  - calcula complexidade ciclomática
- `backend/src/analyzer/ast.js`
  - analisa AST para funções, profundidade e duplicação
- `backend/src/analyzer/score.js`
  - calcula score e status geral
- `backend/src/analyzer/recommendations.js`
  - monta recomendações de melhoria

A ideia é que cada arquivo tenha uma única responsabilidade, tornando o backend mais fácil de estender e testar.

## Fluxo até o relatório

1. Frontend envia o código para o backend.
2. O backend chama `analyzeCode(code)`.
3. `analyzeCode`:
   - executa `lintCode(code)`
   - executa `analyzeComplexity(code)`
   - obtém o AST do código e passa para `analyzeAst(sourceCode, code)`
   - calcula score com `calculateScore(...)`
   - gera recomendações com `buildRecommendations(...)`
4. O backend constrói o objeto final com métricas, detalhes e issues.
5. O frontend recebe o JSON e exibe:
   - score geral
   - resultados de lint
   - saúde do código em gráficos
   - recomendações
   - lista de problemas e detalhes de funções

## Tecnologias utilizadas

- Frontend
  - AngularJS 1.x
  - CodeMirror
  - HTML/CSS
- Backend
  - Node.js
  - Express
  - ESLint
  - typhonjs-escomplex
- Ferramentas
  - `concurrently` para rodar frontend e backend juntos
  - `kill-port` para liberar portas de desenvolvimento

## Como executar

1. Instale as dependências:

```bash
npm run install-all
```

2. Inicie a aplicação:

```bash
npm run dev
```

ou

```bash
npm run up
```

3. Abra o frontend em `http://localhost:3001` e use o backend em `http://localhost:3000`.

## Observações

O projeto foi pensado para ser simples e funcional. Ele não é um substituto completo para ferramentas de análise de código corporativas, mas oferece uma boa visão inicial de problemas de qualidade e complexidade em JavaScript.

## Como parar o projeto

Quando quiser encerrar a aplicação, use:

```bash
npm run down
```

Esse comando para os dois processos de desenvolvimento e libera as portas `3000` e `3001`.

Se quiser parar apenas um lado manualmente, use o comando específico do terminal ou finalize o processo em execução.
