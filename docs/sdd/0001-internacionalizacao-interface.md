# Internacionalização da interface

## Status

- Estado: concluída
- Autor: Codex
- Data: 2026-06-26
- Conclusão: 2026-06-30

## Problema

A aplicação já possui `vue-i18n` e arquivos de tradução para português, inglês e espanhol,
mas a internacionalização ainda não está completa. Muitas frases visíveis ao usuário estão
escritas diretamente em componentes, stores e composables, principalmente em telas de
configuração, mensagens de erro/sucesso, diálogos, previews do painel e textos de teste.

Isso causa três problemas:

- ao trocar o idioma, partes da tela continuam em português;
- `en.json` e `es.json` não têm todas as chaves existentes em `pt_BR.json`;
- novas telas podem continuar adicionando textos fixos sem perceber.

## Objetivos

- Centralizar todos os textos visíveis ao usuário em `src/locales/`.
- Fazer `pt_BR`, `en` e `es` terem o mesmo conjunto de chaves.
- Corrigir traduções incompletas ou ainda em português dentro de `en.json` e `es.json`.
- Garantir que a troca de idioma afete configurações, painel, previews, diálogos e mensagens
  exibidas ao usuário.
- Adicionar testes simples para evitar que chaves de tradução fiquem faltando.
- Atualizar o `README.md`, se a implementação mudar ou esclarecer como o usuário escolhe idioma.

## Não objetivos

- Não adicionar novos idiomas além de `pt_BR`, `en` e `es`.
- Não alterar o layout, tema visual ou modelo de painel.
- Não traduzir nomes vindos da API do NovoSGA, como unidades, serviços, locais, clientes ou senhas.
- Não traduzir comentários de código, nomes de variáveis, payloads da API ou logs técnicos que não
  aparecem para o usuário final.
- Não substituir a biblioteca `vue-i18n`.

## Escopo

- Arquivos de tradução:
  - `src/locales/pt_BR.json`
  - `src/locales/en.json`
  - `src/locales/es.json`
- Plugin de i18n:
  - `src/plugins/i18n.js`
- Tela de configurações:
  - `src/pages/settings.vue`
- Componentes reutilizáveis:
  - `src/components/DialogGetImageUrlFromCustom.vue`
  - `src/components/ResetConfiguration.vue`
  - `src/components/SpeechTextEditor.vue`
- Painéis e previews:
  - `src/components/panels/Default/*`
  - `src/components/panels/Model001/*`
- Stores e composables que mostram mensagens ao usuário:
  - `src/stores/settings.js`
  - `src/stores/auth.js`
  - `src/composables/api/21.js`
- Testes em `src/__tests__/`.
- Documentação no `README.md`, se necessário.

## Comportamento esperado

Ao selecionar português, inglês ou espanhol nas configurações, todos os textos visíveis da
interface devem aparecer no idioma escolhido. Isso inclui:

- menus e títulos;
- labels, placeholders, botões e switches;
- textos de ajuda;
- diálogos de confirmação;
- mensagens de sucesso, erro e sessão expirada;
- textos de estado vazio;
- labels do editor de fala;
- labels e exemplos exibidos nos previews dos painéis.

Quando uma tradução estiver faltando, a aplicação não deve quebrar. Durante desenvolvimento e
testes, a falta de chave deve ser detectada por teste unitário.

Estados esperados:

- Sucesso: o idioma selecionado é aplicado imediatamente e persistido em `localStorage`.
- Erro: mensagens exibidas ao usuário usam chaves de tradução, inclusive quando originadas em
  stores ou composables.
- Loading: qualquer texto de carregamento existente ou novo deve usar `vue-i18n`.
- Vazio: textos como "nenhum serviço", "histórico vazio" e equivalentes devem ser traduzidos.

## Contratos e dados

- O valor persistido em `settings.locale` continua usando os códigos atuais:
  - `pt_BR`
  - `en`
  - `es`
- Não há mudança de contrato com a API do NovoSGA.
- Não há migração obrigatória de `localStorage`.
- Os arquivos `src/locales/*.json` devem manter estrutura plana de chaves, seguindo o padrão atual
  como `settings.label.server` e `panel.history.title`.
- `pt_BR.json` será a referência principal de chaves. `en.json` e `es.json` devem conter exatamente
  as mesmas chaves, salvo justificativa registrada na implementação.
- Textos dinâmicos com variáveis devem usar interpolação do `vue-i18n`, por exemplo:
  `t('message.retry_count', { attempts })`.

## Requisitos

- R1: Mapear textos visíveis hardcoded em `src/pages/`, `src/components/`, `src/stores/` e
  `src/composables/`.
- R2: Mover textos visíveis hardcoded para chaves em `src/locales/pt_BR.json`.
- R3: Traduzir todas as novas chaves para `src/locales/en.json` e `src/locales/es.json`.
- R4: Garantir que `pt_BR`, `en` e `es` tenham o mesmo conjunto de chaves.
- R5: Usar `$t` em templates e `useI18n()` ou `i18n.global.t` em scripts, stores e composables,
  conforme o padrão já usado no projeto.
- R6: Manter `pt_BR` como idioma padrão da store de configurações.
- R7: Manter `fallbackLocale` configurado para evitar tela quebrada quando houver erro inesperado.
- R8: Corrigir traduções existentes em `en.json` e `es.json` que ainda estejam em português.
- R9: Adicionar teste unitário que falhe quando algum locale não tiver as mesmas chaves do
  locale de referência.
- R10: Adicionar teste unitário, quando viável, para comportamento que gera mensagem traduzida em
  store/composable.
- R11: Atualizar o `README.md` se a implementação alterar ou esclarecer o uso da seleção de idioma.

## Critérios de aceite

- AC1: Não há texto visível ao usuário em português fixo dentro dos templates de
  `src/pages/settings.vue`, `src/components/` e `src/components/panels/`, exceto dados de exemplo
  explicitamente justificados.
- AC2: Mensagens de sucesso, erro e sessão expirada disparadas por stores/composables usam chaves
  de tradução.
- AC3: `src/locales/pt_BR.json`, `src/locales/en.json` e `src/locales/es.json` possuem exatamente
  as mesmas chaves.
- AC4: `en.json` e `es.json` não mantêm traduções em português para labels já mapeados.
- AC5: Ao alterar `settingsStore.locale`, a interface renderizada passa a usar o idioma escolhido
  sem exigir recarregar a página.
- AC6: O texto de fala gerado por `panelStore.getParsedSpeechText()` continua usando o idioma ativo
  para a palavra "Senha"/"Ticket"/"Turno" conforme o locale.
- AC7: `npm run test:unit` passa com testes cobrindo paridade de chaves e pelo menos um fluxo
  traduzido em store/composable.
- AC8: `npm run lint` passa.
- AC9: `npm run build` passa.
- AC10: O `README.md` é atualizado quando a implementação afetar instruções de uso ou configuração
  de idioma; se não houver mudança necessária, isso deve ser registrado no resultado da spec.

## Plano de implementação

1. Inspecionar `src/` para listar todos os textos visíveis hardcoded.
2. Separar textos de usuário final de comentários, logs técnicos e dados vindos da API.
3. Criar ou reorganizar chaves em `src/locales/pt_BR.json`.
4. Preencher as mesmas chaves em `src/locales/en.json` e `src/locales/es.json`.
5. Trocar textos fixos em templates por `$t('chave')`.
6. Trocar textos fixos em scripts, stores e composables por `t('chave')` ou `i18n.global.t`.
7. Garantir que textos com variáveis usem interpolação do `vue-i18n`.
8. Adicionar teste de paridade das chaves entre locales.
9. Atualizar ou adicionar testes de store/composable para mensagem traduzida.
10. Avaliar e atualizar o `README.md` se necessário.
11. Rodar verificações.

## Plano de verificação

- `npm run test:unit`: deve passar.
- `npm run lint`: deve passar.
- `npm run build`: deve passar.
- Verificação manual:
  - abrir a tela de configurações;
  - alternar entre Português, English e Español;
  - conferir títulos, campos, botões, diálogos e mensagens;
  - abrir preview dos modelos de painel;
  - testar mensagem de sucesso/erro de configuração quando possível;
  - testar fala/preview com idioma ativo.

## Testes unitários obrigatórios

- Teste para R4: comparar as chaves de `pt_BR`, `en` e `es` e falhar se houver chave ausente ou
  extra.
- Teste para R6: confirmar que o idioma padrão continua `pt_BR` quando não há configuração salva.
- Teste para R9: cobrir paridade de locale como regra permanente.
- Teste para R10: validar pelo menos uma mensagem traduzida em store/composable ou o texto de fala
  gerado por `panelStore.getParsedSpeechText()` em mais de um idioma.

## Riscos e cuidados

- Risco: traduzir textos técnicos que não aparecem ao usuário e aumentar ruído no diff.
- Mitigação: limitar a alteração a textos visíveis ou mensagens que podem chegar à interface.

- Risco: quebrar testes existentes que esperam frases em português.
- Mitigação: atualizar expectativas para usar o locale ativo ou as chaves traduzidas.

- Risco: `en.json` ou `es.json` ficarem incompletos após novas chaves.
- Mitigação: teste automático de paridade de chaves.

- Risco: tradução incorreta de termos de domínio.
- Mitigação: manter termos técnicos como "NovoSGA", "Client ID", "Client Secret", "API" e nomes
  vindos do servidor sem tradução quando fizer sentido.

## Resultado

- Alterações realizadas:
  - Foi criado um inventário dos textos visíveis hardcoded encontrados no escopo da spec em
    `docs/sdd/0001-internacionalizacao-interface-inventario.md`.
  - Textos visíveis da tela de configurações foram movidos para chaves de tradução, incluindo
    servidor, serviços, painel, áudio, área crítica, navegação, seletor de idioma e modo escuro.
  - Componentes reutilizáveis passaram a usar i18n para botões, diálogos, ações críticas e editor
    de fala.
  - Previews e modelos de painel passaram a usar chaves de tradução para labels, estados vazios,
    histórico e exemplos visíveis.
  - Stores e composables que geram mensagens ao usuário passaram a usar `vue-i18n`.
  - Foram adicionadas ou reorganizadas chaves em `src/locales/pt_BR.json`, `src/locales/en.json` e
    `src/locales/es.json`, mantendo os três arquivos com o mesmo conjunto de chaves.
  - Foram adicionados testes unitários para paridade de locales e para fluxos traduzidos em
    stores, composables, configurações, componentes reutilizáveis e previews de painel.

- Critérios de aceite verificados:
  - AC1: verificado por testes estáticos e busca manual. Os textos visíveis em português que ainda
    aparecem fora de `src/locales/` são comentários, logs técnicos, nomes de variáveis ou dados de
    domínio vindos da API, que estão fora do escopo da spec.
  - AC2: mensagens de sucesso, erro e sessão expirada em stores/composables usam chaves de
    tradução.
  - AC3: `src/__tests__/locales.spec.js` valida que `pt_BR`, `en` e `es` têm as mesmas chaves.
  - AC4: traduções mapeadas em `en.json` e `es.json` foram preenchidas nos respectivos idiomas.
  - AC5: a troca de `settingsStore.locale` atualiza o locale ativo do `vue-i18n` sem exigir reload.
  - AC6: `panelStore.getParsedSpeechText()` foi coberto por teste usando o idioma ativo.
  - AC7: `npm run test:unit -- --run` passou com 10 arquivos de teste e 38 testes.
  - AC8: `npm run lint` passou.
  - AC9: `npm run build` passou. O Vite manteve apenas o aviso conhecido de chunks acima de 500 kB.
  - AC10: o `README.md` não precisou ser alterado, porque a implementação não mudou instruções de
    uso, instalação, configuração ou escolha de idioma; apenas centralizou textos já existentes em
    chaves de tradução.

- Pendências:
  - Nenhuma pendência funcional conhecida para a spec 0001.
  - A verificação manual completa em navegador pode ser repetida antes do release para conferir
    visualmente todos os textos em Português, English e Español.
