# Limite de altura para logos do rodapé

## Status

- Estado: concluido
- Autor: Codex
- Data: 2026-07-09

## Problema

As logos exibidas no canto inferior do painel tinham largura fixa, mas não tinham limite explícito de altura. Quando uma imagem mais alta era usada, ela podia extrapolar a área visual do rodapé.

## Objetivos

- Garantir que logos do rodapé respeitem a altura disponível.
- Manter a proporção das imagens sem criar novas configurações.

## Não objetivos

- Alterar a configuração das logos do cabeçalho.
- Criar controles de recorte, zoom ou redimensionamento manual.

## Escopo

Painéis `Default`, `Model001` e `Alert`, incluindo suas views de `Panel` e `Preview`.

## Comportamento esperado

As logos do rodapé devem continuar com largura limitada, manter a proporção e também respeitar a altura máxima do contêiner do rodapé no painel e no preview.

## Contratos e dados

Sem mudanças de API, storage ou variáveis de ambiente.

## Requisitos

- R1: Toda logo do rodapé deve ter largura máxima e altura máxima.
- R2: A imagem não pode distorcer sua proporção.
- R3: O mesmo comportamento deve valer para painel real e preview.

## Critérios de aceite

- AC1: Logos altas não ultrapassam visualmente a altura do rodapé.
- AC2: Logos horizontais continuam cabendo no espaço disponível.
- AC3: Os três modelos de painel usam a mesma regra visual.

## Plano de implementação

1. Inspecionar os componentes que renderizam logos do rodapé.
2. Aplicar classes utilitárias de tamanho mínimo necessário.
3. Atualizar uma checagem automatizada para evitar regressão.
4. Rodar verificações.

## Plano de verificação

- `npm run test:unit`: executar
- `npm run lint`: não executado
- `npm run build`: não executado
- Verificação manual: conferir preview e painel com logo vertical no rodapé

## Testes unitários obrigatórios

- Teste para R1: validar que os componentes do rodapé aplicam `max-h-*`.
- Teste para R2: validar que os componentes aplicam `object-contain`.
- Teste para R3: validar a regra nos arquivos `Panel` e `Preview`.

## Riscos e cuidados

- Risco: o limite ficar apertado demais para alguma logo existente.
- Mitigação: usar `object-contain` e manter apenas limite máximo, sem cortar imagem.

## Resultado

- Alterações realizadas: adicionadas classes de `max-height` e `object-contain` nas logos do rodapé dos três modelos; adicionada checagem automatizada.
- Critérios de aceite verificados: AC1 e AC3 por inspeção de código; AC2 coberto pela preservação de proporção via CSS.
- Pendências: validação visual manual em execução local.
