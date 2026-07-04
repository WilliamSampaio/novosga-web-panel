# Painel de alerta

## Status

- Estado: concluida
- Autor: Codex
- Data: 2026-07-04
- Conclusao: 2026-07-04

## Problema

Usuarios podem precisar de um painel voltado a alertas operacionais, em que uma chamada atual
continue chamando atencao enquanto permanecer ativa. Esse uso pode variar conforme o criterio de
cada instalacao: setores, filas, servicos, regras internas ou qualquer outro fluxo configurado
no NovoSGA.

Os modelos atuais do painel foram pensados para chamada geral de atendimento. Eles mostram
historico por padrao e dao destaque maior para senha/local do que para o cliente. Para cenarios de
alerta, o painel precisa destacar a chamada atual, mostrar onde ela esta sendo atendida, indicar o
servico relacionado e lembrar periodicamente a equipe enquanto a chamada continuar atual.

## Objetivos

- Criar um novo modelo de painel generico para alertas operacionais.
- Dar enfase visual ao nome do cliente na chamada atual.
- Exibir um cronometro iniciado quando a senha entra no painel via Mercure/API.
- Emitir novo alerta sonoro a cada 15 segundos enquanto a mesma senha continuar atual.
- Manter exibicao de servico, local, prioridade e relogio com data/hora no rodape.
- Manter o modelo independente de qualquer setor, regra ou fluxo especifico, permitindo uso em
  diferentes criterios definidos pelo usuario.

## Não objetivos

- Nao criar regras especificas para setores, filas, servicos ou fluxos no codigo.
- Nao alterar contratos da API do NovoSGA, Mercure/EventSource ou payloads recebidos.
- Nao criar nova configuracao de intervalo de alerta nesta primeira versao.
- Nao criar nova configuracao para exibir historico neste modelo.
- Nao alterar o comportamento dos modelos `default` e `model001`.
- Nao implementar PWA, modo kiosk ou configuracoes de navegador nesta spec.
- Nao adicionar novos sons ao pacote de assets.

## Escopo

- Novo modelo de painel em `src/components/panels/`.
- Registro do modelo em `src/plugins/registry.js`.
- Preview do modelo na tela de configuracoes.
- Uso das stores existentes:
  - `src/stores/main.js`
  - `src/stores/panel.js`
  - `src/stores/settings.js`
- Uso dos composables existentes:
  - `src/composables/audio.js`
  - `src/composables/speech.js`
- Uso do componente `src/components/Clock.vue`.
- Arquivos de traducao em `src/locales/pt_BR.json`, `src/locales/en.json` e
  `src/locales/es.json`, caso novos textos visiveis sejam adicionados.
- Testes unitarios em `src/__tests__/`.
- Documentacao em `README.md`, `README.en.md` e `README.es.md`, se o novo modelo precisar ser
  citado para usuarios/contribuidores.

## Comportamento esperado

Ao selecionar o novo modelo de painel de alerta, a tela deve continuar usando a configuracao de
unidade, servicos, cores, logos, som, voz e relogio ja existentes.

Quando nao houver chamada atual, o painel deve renderizar um estado vazio coerente com os modelos
atuais, sem cronometro ativo e sem alerta repetido.

Quando uma nova senha entrar no painel via fluxo normal de chamada:

- o painel deve tocar o alerta inicial usando `settingsStore.alertSound`;
- se a voz estiver habilitada, deve executar a fala da chamada como nos modelos existentes;
- o cronometro deve iniciar em `00:00`;
- a chamada atual deve destacar principalmente o nome do cliente;
- a senha/codigo, descricao do servico, local e descricao da prioridade devem permanecer visiveis;
- o rodape deve continuar exibindo data/hora quando `footer.showClock` estiver habilitado;
- o historico nao deve ser renderizado no modelo de alerta;
- enquanto a mesma senha continuar como chamada atual, o painel deve tocar novo alerta sonoro a cada
  15 segundos;
- quando outra senha entrar, o cronometro e o ciclo de alerta repetido devem reiniciar para a nova
  senha;
- ao desmontar o componente ou trocar de modelo/rota, timers devem ser limpos para evitar alertas
  em segundo plano.

O modelo deve ser generico. Textos e layout nao devem mencionar setores, fluxos ou
servicos especificos. O criterio de uso sera definido pelo usuario por meio da configuracao de
unidade, servicos e demais dados vindos do NovoSGA.

## Contratos e dados

- Nao ha mudanca na API do NovoSGA.
- Nao ha mudanca no payload recebido via Mercure/EventSource.
- Nao ha migracao obrigatoria de `localStorage`.
- O novo modelo deve ser selecionavel por `panel.model`, como os modelos existentes.
- O identificador tecnico sugerido para o novo modelo e `alert`.
- O nome visivel sugerido no registro e `Alert`.
- O texto padrao de fala do modelo deve usar dados ja disponiveis, como cliente, local e servico,
  sem incluir texto especifico de um cenario de uso.
- O intervalo de repeticao do alerta sonoro deve ser fixo em 15 segundos nesta primeira versao.
- O som repetido deve usar o mesmo arquivo configurado em `settingsStore.alertSound`.

## Requisitos

- R1: Criar um novo modelo de painel selecionavel no registry, sem remover ou alterar os modelos
  existentes.
- R2: O modelo de alerta nao deve renderizar historico de chamadas.
- R3: O nome do cliente deve ser o elemento visual de maior destaque quando `clientName` estiver
  disponivel.
- R4: Quando `clientName` nao estiver disponivel, o painel deve continuar identificando a chamada
  atual pela senha/codigo.
- R5: A senha/codigo da chamada atual deve permanecer visivel mesmo quando houver nome do cliente.
- R6: A descricao do servico deve permanecer visivel.
- R7: O local deve permanecer visivel.
- R8: A descricao da prioridade deve permanecer visivel quando a chamada tiver prioridade; quando
  nao houver descricao, deve usar o fallback traduzido de prioridade ja existente.
- R9: O rodape deve continuar exibindo data/hora atual por meio de `Clock` quando
  `footer.showClock` estiver habilitado.
- R10: O cronometro deve iniciar quando uma nova senha entra no painel pelo fluxo Mercure/API.
- R11: O cronometro deve reiniciar quando a senha atual for substituida por outra senha.
- R12: O painel deve tocar o alerta inicial e executar voz, quando habilitada, no recebimento de uma
  nova senha, mantendo o comportamento basico dos modelos atuais.
- R13: O painel deve emitir alerta sonoro adicional a cada 15 segundos enquanto a mesma senha
  continuar atual.
- R14: O alerta repetido deve parar ou reiniciar quando outra senha entrar.
- R15: Timers/intervalos criados pelo painel devem ser limpos quando o componente for desmontado.
- R16: O preview do modelo deve permitir visualizar o estado principal do painel de alerta.
- R17: Novos textos visiveis ao usuario devem usar `vue-i18n` e manter paridade entre
  `pt_BR`, `en` e `es`.
- R18: O README deve ser atualizado se a implementacao adicionar um novo modelo de painel
  selecionavel que usuarios/contribuidores precisem conhecer.

## Critérios de aceite

- AC1: O modelo de alerta aparece na lista de modelos disponiveis e pode ser selecionado pela
  configuracao atual de painel.
- AC2: Ao renderizar o modelo de alerta com chamada atual, nao ha componente, titulo ou lista de
  historico na tela.
- AC3: Com `clientName` preenchido, o nome do cliente e o texto de maior destaque da area principal,
  e a senha/codigo continua visivel.
- AC4: Com `clientName` ausente, a senha/codigo assume o papel de identificacao principal da
  chamada atual.
- AC5: Servico, local e prioridade sao exibidos para a chamada atual quando os respectivos dados
  existem.
- AC6: O rodape continua respeitando `footer.showClock`; quando habilitado, mostra data/hora pelo
  componente `Clock`.
- AC7: Ao receber uma nova senha, o cronometro inicia em `00:00` e passa a contar o tempo da chamada
  atual.
- AC8: Ao substituir a senha atual, o cronometro reinicia para a nova chamada.
- AC8.1: Ao chamar novamente a mesma senha, o painel pode tocar o audio da chamada, mas o
  cronometro nao reinicia.
- AC9: O alerta sonoro inicial usa `settingsStore.alertSound` quando uma nova senha entra.
- AC10: Com a mesma senha permanecendo atual, o painel solicita novo alerta sonoro aos 15, 30 e 45
  segundos, e assim sucessivamente enquanto o componente estiver montado.
- AC11: Quando o componente e desmontado, nenhum alerta repetido continua sendo executado.
- AC12: Se `settingsStore.speech` estiver habilitado, a fala inicial da nova senha continua sendo
  executada; alertas repetidos de 15 em 15 segundos nao repetem a fala.
- AC13: `npm run test:unit` passa com testes cobrindo registry, ausencia de historico, cronometro e
  alerta repetido.
- AC14: `npm run lint` passa.
- AC15: `npm run build` passa.
- AC16: READMEs em portugues, ingles e espanhol sao atualizados se o novo modelo for exposto na
  documentacao de modelos.

## Plano de implementação

1. Inspecionar os modelos `Default` e `Model001`, registry, preview e testes existentes.
2. Definir o nome da pasta do novo modelo, preferencialmente `src/components/panels/Alert/`.
3. Criar `Panel.vue` do modelo de alerta reaproveitando stores, `Clock`, `useAlert` e `useSpeech`.
4. Implementar controle de cronometro e intervalo de 15 segundos com limpeza no unmount.
5. Garantir que a logica de audio inicial + voz continue equivalente aos modelos atuais.
6. Criar `Preview.vue` do modelo de alerta com dados de exemplo genericos.
7. Registrar o modelo em `src/plugins/registry.js` com identificador `alert`.
8. Adicionar ou ajustar chaves de i18n se houver novos textos visiveis.
9. Criar ou atualizar testes unitarios para registry, renderizacao, cronometro e alerta repetido.
10. Atualizar `README.md`, `README.en.md` e `README.es.md` se a selecao/uso do novo modelo precisar
    ser documentada.
11. Rodar verificacoes.

## Plano de verificação

- `npm run test:unit`: deve passar.
- `npm run lint`: deve passar.
- `npm run build`: deve passar.
- Verificacao manual:
  - abrir a tela de configuracoes;
  - selecionar o modelo de alerta;
  - conferir o preview;
  - abrir o painel real com uma senha de teste;
  - verificar destaque do cliente, senha, servico, local, prioridade e relogio;
  - aguardar pelo menos 30 segundos e confirmar alertas sonoros aos 15 e 30 segundos;
  - chamar outra senha e confirmar que o cronometro reinicia;
  - trocar de rota/modelo e confirmar que o alerta repetido para.

## Testes unitários obrigatórios

- Teste para R1/AC1: confirmar que `LIST_PANEL_MODELS` contem o modelo `alert` com componente e
  preview carregaveis.
- Teste para R2/AC2: montar o modelo de alerta e confirmar que nao renderiza textos/listas de
  historico.
- Teste para R3/R4/R5/AC3/AC4: montar o painel com e sem `clientName` e validar a identificacao
  principal da chamada.
- Teste para R6/R7/R8/AC5: validar exibicao de servico, local e prioridade.
- Teste para R10/R11/AC7/AC8: usar timers fake para validar inicio e reinicio do cronometro por
  nova senha.
- Teste para R13/R14/R15/AC10/AC11: usar timers fake e mock de `playAlert` para validar alertas
  repetidos e limpeza no unmount.
- Teste para R12/AC12: validar que a voz continua sendo chamada apenas no alerta inicial quando
  `settingsStore.speech` estiver habilitado.
- Teste para R17: se novas chaves forem adicionadas, manter ou atualizar teste de paridade dos
  locales.

## Riscos e cuidados

- Risco: alerta repetido continuar tocando apos trocar de rota ou modelo.
- Mitigacao: limpar intervalos/timeouts em `onBeforeUnmount` e testar desmontagem.

- Risco: alerta repetido conflitar com a fila de audio inicial dos modelos atuais.
- Mitigacao: manter a fila de audio inicial restrita a novas chamadas e tratar o alerta repetido
  como lembrete sonoro sem voz.

- Risco: cronometro reiniciar indevidamente ao chamar novamente a mesma senha.
- Mitigacao: comparar uma chave estavel da chamada atual, como `type + ticket`, antes de reiniciar.

- Risco: ausencia de `clientName` deixar o painel sem destaque util.
- Mitigacao: usar senha/codigo como fallback principal.

- Risco: layout ficar especifico demais para um unico fluxo operacional.
- Mitigacao: usar apenas dados genericos da chamada, cliente, servico, local e prioridade.

- Risco: testes com timers ficarem frageis.
- Mitigacao: usar fake timers do Vitest e mocks explicitos para audio/voz.

## Resultado

- Alteracoes realizadas:
  - Foi criado o modelo `alert` em `src/components/panels/Alert/Panel.vue` e
    `src/components/panels/Alert/Preview.vue`.
  - O modelo foi registrado em `src/plugins/registry.js` com identificador `alert`.
  - O painel de alerta renderiza chamada atual sem historico, com cliente ou senha em destaque,
    atendimento, servico, local, prioridade e relogio no rodape.
  - O cronometro inicia quando uma nova senha entra, reinicia ao mudar de senha e nao reinicia ao
    chamar novamente a mesma senha.
  - O alerta sonoro inicial e a voz seguem as configuracoes existentes; alertas recorrentes tocam a
    cada 15 segundos sem repetir voz.
  - Timers sao limpos ao desmontar o componente.
  - Foi adicionada a chave `panel.alert.attendance` em `pt_BR`, `en` e `es`.
  - Foram adicionados testes unitarios para registry, renderizacao, cronometro, rechamada, alerta
    recorrente, voz inicial e limpeza no unmount.
  - Os READMEs em portugues, ingles e espanhol foram atualizados com o modelo `alert`.

- Criterios de aceite verificados:
  - AC1: verificado por `src/__tests__/panel.spec.js`.
  - AC2 a AC12: verificados por `src/__tests__/alert_panel.spec.js`.
  - AC13: `npm run test:unit` passou.
  - AC14: `npm run lint` passou.
  - AC15: `npm run build` passou durante a implementacao.
  - AC16: `README.md`, `README.en.md` e `README.es.md` foram atualizados.

- Pendencias:
  - Nenhuma pendencia funcional conhecida.
