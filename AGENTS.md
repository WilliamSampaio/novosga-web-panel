# Repository Guidelines

## Estrutura do Projeto e Organização de Módulos

Este é um painel web em Vue 3 + Vite. O código da aplicação fica em `src/`: views de páginas em `src/pages/`, UI reutilizável em `src/components/`, rotas em `src/router/`, stores Pinia em `src/stores/`, plugins em `src/plugins/`, composables em `src/composables/` e utilitários compartilhados em `src/util/`. Testes unitários usam `src/__tests__/`. Arquivos estáticos ficam em `public/`, incluindo logos em `public/images/`, sons em `public/sound/` e imagens customizadas montadas pelo usuário via `public/images/custom/` ou pelo volume Docker `./images`.

## Comandos de Build, Teste e Desenvolvimento

- Instalação: `npm install` instala as dependências. Use Node `^20.19.0` ou `>=22.12.0`.
- Desenvolvimento: `npm run dev` inicia o servidor de desenvolvimento do Vite.
- Testes: `npm run test:unit` executa os testes unitários com Vitest e `jsdom`.
- Lint: `npm run lint` executa `lint:oxlint` e `lint:eslint` via `run-s lint:*`.
- Lint detalhado: `npm run lint:oxlint` roda `oxlint . --fix`; `npm run lint:eslint` roda `eslint . --fix --cache`.
- Build: `npm run build` gera o bundle de produção com `vite build` em `dist/`.
- Preview: `npm run preview` serve localmente o bundle gerado.

## Estilo de Código e Convenções de Nomeação

Use ES modules, Vue single-file components e o alias `@` para imports a partir de `src/`. Siga `.editorconfig`: UTF-8, finais de linha LF, indentação de dois espaços, newline final e linhas de até 100 caracteres. O Prettier aplica ausência de semicolons e single quotes. Arquivos de componentes usam PascalCase quando representam componentes reutilizáveis; páginas de rota seguem o padrão atual em lowercase, como `home.vue` e `settings.vue`. Mantenha stores e composables focados por domínio, por exemplo `src/stores/settings.js` ou `src/composables/audio.js`.

## Diretrizes de Testes

O Vitest está configurado em `vitest.config.js` com `jsdom`; arquivos de teste devem ficar em `src/**/__tests__/*` e normalmente usam o sufixo `*.spec.js`, como `src/__tests__/App.spec.js`. Adicione testes para comportamentos que afetem rotas, stores, renderização, integração com API ou estado visível ao usuário. Execute `npm run test:unit` antes de enviar alterações e combine com `npm run lint` para validações de qualidade.

## Workflow SDD

Para mudanças de comportamento, integração, UI relevante, persistência ou regras de negócio, comece por uma spec em `docs/sdd/` usando `docs/sdd/template.md`. A spec deve registrar problema, escopo, requisitos, critérios de aceite e plano de verificação. Implemente apenas o que estiver coberto pela spec aprovada e atualize testes ou documentação diretamente relacionados.

## Diretrizes de Commits e Pull Requests

O histórico atual usa mensagens curtas e imperativas, às vezes em português, como `update`, `remove` e `volta pra logica antiga...`. Prefira resumos imperativos mais claros, como `fix panel history after reload`. Pull requests devem incluir descrição objetiva, issue vinculada quando houver, resultados dos testes e screenshots ou gravações para mudanças de UI.

## Dicas de Segurança e Configuração

Não faça commit de secrets, arquivos locais de ambiente ou saída gerada em `dist/`. Mantenha opções de deploy em variáveis de ambiente como `DOCKER_COMPOSE_HOST_PORT` e `DOCKER_COMPOSE_CUSTOM_IMAGES_DIR`. Trate imagens e sons customizados como assets estáticos e evite hardcoded paths específicos da máquina.
