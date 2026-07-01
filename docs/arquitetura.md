# Arquitetura

## Visão geral da aplicação

O projeto é um painel web para NovoSGA construído com Vue 3, Vite, Vue Router, Pinia e Vuetify. A aplicação exibe chamadas de atendimento em tempo real, permite configurar servidor, unidade, serviços, aparência do painel, sons e síntese de voz.

O painel principal fica em `/` e a tela de configuração fica em `/settings`, usando `createWebHashHistory`. Em produção, o build estático é servido por nginx via `Dockerfile` e `compose.yml`.

## Principais diretórios

- `src/pages/`: telas de rota, principalmente `home.vue` e `settings.vue`.
- `src/components/`: componentes reutilizáveis de UI.
- `src/components/panels/`: modelos visuais do painel e seus previews.
- `src/stores/`: stores Pinia para estado global e regras de estado.
- `src/composables/`: integrações reutilizáveis, como API, storage, áudio e speech.
- `src/plugins/`: inicialização de bibliotecas e registry de modelos de painel.
- `src/locales/`: mensagens de internacionalização.
- `public/`: assets estáticos, incluindo imagens e sons.

## Fluxo de inicialização

`src/main.js` cria a aplicação Vue, registra `router`, `i18n`, `pinia` e `vuetify`, importa `src/style.css` e monta o app em `#app`.

`src/App.vue` renderiza o `RouterView`, exibe a fila global de mensagens em `v-snackbar-queue` e aplica o tema claro/escuro a partir de `useSettingsStore`.

Ao abrir `/`, `src/pages/home.vue` valida configuração mínima (`apiUrl` e unidade), autentica ou renova token via `useAuthStore`, busca informações da API, monta a URL do Mercure e abre um `EventSource`. Cada evento aciona a busca de mensagens no `useMainStore`.

## Comunicação entre módulos

As páginas consomem stores Pinia diretamente. `home.vue` coordena `auth`, `server`, `settings`, `main` e `panel`. `settings.vue` edita configurações persistidas e carrega unidades/serviços.

`src/composables/api/21.js` encapsula Axios, retries e interceptors. Ele injeta `Authorization: Bearer` a partir de `useAuthStore` e tenta `refresh()` em respostas `401`.

`useMainStore` usa `useServerStore` e `useSettingsStore` para chamar a API, normalizar mensagens e manter mensagem atual e histórico. `usePanelStore` controla modelo visual, logos, cores e texto de fala. `src/plugins/registry.js` mapeia as chaves de modelo para componentes carregados de forma assíncrona.

## Regras, infraestrutura, interface e persistência

- Regras de negócio: stores em `src/stores/`, especialmente normalização de mensagens em `main.js`, autenticação em `auth.js` e parsing de fala em `panel.js`.
- Infraestrutura: cliente HTTP em `src/composables/api/21.js`, storage em `src/composables/storage.js`, roteamento em `src/router/` e plugins em `src/plugins/`.
- Interface: páginas em `src/pages/`, componentes em `src/components/` e modelos de painel em `src/components/panels/`.
- Persistência: `localStorage` via `src/composables/storage.js`, com prefixo `painel-web.v3.`. Configurações também podem vir de variáveis `VITE_*`.

## Cuidados para futuras alterações

- Não assumir que `apiVersion` muda o cliente usado: hoje o código usa `Client21`.
- Ao adicionar um novo modelo de painel, criar os componentes em `src/components/panels/` e registrar a chave em `src/plugins/registry.js`.
- Alterações em autenticação, retries ou interceptors podem afetar todas as chamadas de API.
- Credenciais e tokens são persistidos em `localStorage`; evite renderizar HTML externo ou introduzir caminhos que aumentem risco de XSS.
- `npm run lint` aplica correções automáticas; confira o diff antes de commitar.
- Adicione testes para mudanças em stores, parsing de mensagens, autenticação, storage e seleção de modelos.
- Preserve compatibilidade com assets estáticos em `public/`, especialmente sons e imagens customizadas montadas por Docker.
