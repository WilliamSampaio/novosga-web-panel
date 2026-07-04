# NovoSGA Web Panel

[Portugues](README.md) | [English](README.en.md) | [Espanol](README.es.md)

## Sumario

- [O Que Este Projeto Faz](#o-que-este-projeto-faz)
- [Stack Principal](#stack-principal)
- [Antes de Comecar](#antes-de-comecar)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Comandos Importantes](#comandos-importantes)
- [Como Rodar Testes](#como-rodar-testes)
- [Como Fazer Build](#como-fazer-build)
- [Como Rodar com Docker](#como-rodar-com-docker)
- [Como Abrir em Producao no Chrome](#como-abrir-em-producao-no-chrome)
- [Configuracao por Variaveis de Ambiente](#configuracao-por-variaveis-de-ambiente)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como a Aplicacao Funciona](#como-a-aplicacao-funciona)
- [Principais Arquivos](#principais-arquivos)
- [Adicionando um Novo Modelo de Painel](#adicionando-um-novo-modelo-de-painel)
- [Workflow SDD](#workflow-sdd)
- [Regra de Documentacao](#regra-de-documentacao)
- [Cuidados de Seguranca](#cuidados-de-seguranca)
- [Onde Ler Mais](#onde-ler-mais)

Um painel web para mostrar chamadas de atendimento do NovoSGA em uma tela.

Pense nele assim:

```text
NovoSGA -> API/Mercure -> este painel -> tela com senha, cliente, local e historico
```

Ele tambem permite configurar cores, logos, sons, voz, unidade e servicos pela propria interface.

## O Que Este Projeto Faz

- Mostra a senha chamada no painel.
- Mantem um historico das ultimas chamadas.
- Toca um som quando chega uma nova chamada.
- Pode falar a chamada usando a voz do navegador.
- Permite escolher unidade e servicos do NovoSGA.
- Permite personalizar modelo, cores, logos e relogio do painel.
- Salva configuracoes no `localStorage` do navegador.

## Stack Principal

- Vue 3
- Vite
- Vue Router
- Pinia
- Vuetify
- vue-i18n
- Axios + axios-retry
- Vitest
- ESLint, Oxlint e Prettier
- Docker + nginx para producao

## Antes de Comecar

Instale uma versao compativel do Node.js:

```sh
node --version
```

O projeto espera Node `^20.19.0` ou `>=22.12.0`.

Depois instale as dependencias:

```sh
npm install
```

## Como Rodar Localmente

Inicie o servidor de desenvolvimento:

```sh
npm run dev
```

Abra a URL mostrada no terminal. Normalmente sera algo como:

```text
http://localhost:5173/
```

Rotas principais:

- `/#/`: painel de chamadas.
- `/#/settings`: tela de configuracao.

Na primeira vez, va em `/#/settings` e configure:

1. URL do servidor NovoSGA.
2. Usuario e senha da API.
3. Client ID e Client Secret.
4. Unidade.
5. Servicos que devem aparecer no painel.
6. Aparencia, som e voz, se quiser.

## Comandos Importantes

| Comando | Para que serve |
| --- | --- |
| `npm install` | Instala as dependencias. |
| `npm run dev` | Roda o projeto em modo desenvolvimento. |
| `npm run test:unit` | Roda os testes unitarios com Vitest. |
| `npm run lint` | Roda Oxlint e ESLint com correcao automatica. |
| `npm run format` | Formata `src/` com Prettier. |
| `npm run build` | Gera a versao de producao em `dist/`. |
| `npm run preview` | Serve localmente o build gerado. |

Atencao: `npm run lint` usa `--fix`, entao ele pode alterar arquivos. Confira o diff depois.

## Como Rodar Testes

```sh
npm run test:unit
```

Os testes ficam em:

```text
src/__tests__/
```

Toda nova funcionalidade ou alteracao de regra deve incluir ou atualizar testes unitarios. Se nao der para testar automaticamente, explique o motivo na spec ou no PR e descreva a verificacao manual.

## Como Fazer Build

```sh
npm run build
```

O Vite gera os arquivos finais em:

```text
dist/
```

Para testar esse build localmente:

```sh
npm run preview
```

## Como Rodar com Docker

```sh
docker compose up --build
```

Por padrao, o painel fica em:

```text
http://localhost:8081/
```

Voce pode mudar a porta com:

```sh
DOCKER_COMPOSE_HOST_PORT=8082 docker compose up --build
```

Imagens customizadas podem ser montadas no container. Por padrao, o `compose.yml` usa:

```text
./images -> /usr/share/nginx/html/images/custom
```

## Como Abrir em Producao no Chrome

Em telas de atendimento, o painel normalmente roda em um computador dedicado ligado a uma
TV ou monitor. No Chrome, abra o painel em modo kiosk para ocupar a tela inteira e permitir
som/voz sem clique manual:

```sh
google-chrome --kiosk --autoplay-policy=no-user-gesture-required http://127.0.0.1:8080
```

Use a URL e porta do seu ambiente. Se estiver usando o Docker padrao deste projeto, a URL
normalmente sera `http://127.0.0.1:8081/`.

- `--kiosk`: abre o Chrome em tela cheia, sem barra de endereco e controles normais.
- `--autoplay-policy=no-user-gesture-required`: permite reproducao automatica de midia,
  importante para som de alerta e voz do navegador.

## Configuracao por Variaveis de Ambiente

Algumas configuracoes podem vir de variaveis `VITE_*`:

| Variavel | Uso |
| --- | --- |
| `VITE_API_VERSION` | Versao configurada da API. |
| `VITE_API_URL` | URL do servidor NovoSGA. |
| `VITE_API_USERNAME` | Usuario da API. |
| `VITE_API_PASSWORD` | Senha da API. |
| `VITE_API_CLIENT_ID` | Client ID OAuth. |
| `VITE_API_CLIENT_SECRET` | Client Secret OAuth. |
| `VITE_API_RETRIES` | Numero de tentativas em falhas de rede/API. |
| `VITE_PANEL` | Modelo inicial do painel, como `default` ou `model001`. |

Tambem existem variaveis para cores, logos e exibicao do relogio. Veja `src/stores/panel.js` para a lista completa.

## Estrutura de Pastas

```text
src/
  pages/              telas principais: home e settings
  components/         componentes de interface
  components/panels/  modelos visuais do painel
  stores/             estado global e regras com Pinia
  composables/        API, storage, audio e speech
  plugins/            Vuetify, Pinia, i18n e registry dos paineis
  locales/            traducoes
  __tests__/          testes unitarios
public/
  images/             logos e imagens
  sound/              sons de alerta
docs/
  arquitetura.md      visao tecnica da arquitetura
  sdd/                specs e workflow de Spec-Driven Development
```

## Como a Aplicacao Funciona

Fluxo simples:

```text
1. O app inicia em src/main.js
2. O Vue registra router, Pinia, i18n e Vuetify
3. A rota /#/ abre o painel
4. O painel verifica se existe configuracao
5. O app autentica na API do NovoSGA
6. O app conecta no Mercure com EventSource
7. Quando chega uma chamada, busca a mensagem na API
8. A store normaliza os dados
9. O componente de painel mostra a chamada na tela
10. Som e voz podem ser executados
```

## Principais Arquivos

- `src/main.js`: liga a aplicacao.
- `src/App.vue`: base visual, tema e mensagens globais.
- `src/router/index.js`: rotas `/#/` e `/#/settings`.
- `src/pages/home.vue`: painel em execucao, autenticacao e Mercure.
- `src/pages/settings.vue`: tela de configuracoes.
- `src/stores/auth.js`: token, refresh token e logout.
- `src/stores/main.js`: mensagem atual, historico e normalizacao.
- `src/stores/panel.js`: modelo, cores, logos e texto de voz.
- `src/stores/settings.js`: unidade, servicos, idioma, som e tema.
- `src/composables/api/21.js`: cliente HTTP para API.
- `src/composables/storage.js`: persistencia em `localStorage`.
- `src/plugins/registry.js`: lista de modelos de painel.

## Adicionando um Novo Modelo de Painel

1. Crie uma pasta em `src/components/panels/NomeDoModelo/`.
2. Crie o componente principal `Panel.vue`.
3. Crie o preview `Preview.vue`.
4. Registre o modelo em `src/plugins/registry.js`.
5. Adicione ou atualize testes unitarios.
6. Atualize este README se o usuario precisar saber da novidade.

## Workflow SDD

Para mudancas maiores, use o fluxo em:

```text
docs/sdd/
```

Resumo:

1. Crie uma spec a partir de `docs/sdd/template.md`.
2. Escreva problema, escopo, requisitos e criterios de aceite.
3. Planeje testes unitarios.
4. Implemente apenas o que a spec pede.
5. Rode testes, lint e build quando fizer sentido.

## Regra de Documentacao

Toda nova funcionalidade ou alteracao deve verificar se o README precisa ser atualizado.

Atualize este README quando a mudanca:

- adicionar comando novo;
- mudar como instalar, rodar, testar ou fazer build;
- adicionar tela, fluxo ou configuracao importante;
- mudar variaveis de ambiente;
- adicionar modelo de painel;
- alterar comportamento que o usuario precisa entender.

Se a mudanca for interna e nao afetar uso, instalacao ou entendimento do projeto, o README pode ficar igual.

## Cuidados de Seguranca

- Credenciais e tokens podem ser salvos no `localStorage`.
- Evite usar este painel em computador compartilhado sem cuidado.
- Nao commite `.env`, secrets ou dados reais de acesso.
- Revise com atencao qualquer mudanca que renderize conteudo vindo da API.

## Onde Ler Mais

- `docs/arquitetura.md`: explicacao tecnica da arquitetura.
- `docs/sdd/README.md`: fluxo de Spec-Driven Development.
- `AGENTS.md`: guia rapido para contribuidores e agentes.
