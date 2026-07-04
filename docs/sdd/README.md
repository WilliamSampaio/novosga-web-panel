# SDD Workflow

Este diretório define o fluxo de Spec-Driven Development do projeto. Use este processo para mudanças de produto, comportamento, integração, UI relevante, persistência ou regras de negócio.

## Quando criar uma spec

Crie uma spec antes de implementar quando a mudança:

- altera comportamento visível ao usuário;
- muda contrato com a API do NovoSGA;
- adiciona ou altera stores, composables ou modelos de painel;
- afeta persistência em `localStorage` ou variáveis `VITE_*`;
- envolve fluxo de autenticação, Mercure/EventSource, áudio ou speech;
- exige decisões de UX, estados de erro, loading ou vazio.

Correções pequenas e mecânicas podem ir direto para implementação, desde que o diff seja óbvio e bem testado.

## Nome dos arquivos

Use o padrão:

```text
docs/sdd/NNNN-descricao-curta.md
```

Exemplos:

```text
docs/sdd/0001-suporte-novosga-22.md
docs/sdd/0002-novo-modelo-painel.md
```

## Fluxo

1. Copie `docs/sdd/template.md` para um novo arquivo numerado.
2. Preencha problema, escopo, não objetivos, requisitos e critérios de aceite.
3. Revise ambiguidades antes de codificar. Requisitos vagos devem virar expectativas verificáveis.
4. Implemente apenas o necessário para atender a spec aprovada.
5. Inclua ou atualize testes unitários para toda nova funcionalidade e para regras alteradas.
6. Rode as verificações aplicáveis e registre o resultado na spec ou no PR.

## Verificações recomendadas

- Testes unitários: `npm run test:unit`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview manual do build: `npm run preview`

Observação: `npm run lint` aplica correções automáticas via `--fix`; confira o diff depois de executar.

## Áreas do projeto

- Interface: `src/pages/`, `src/components/`, `src/components/panels/`
- Estado e regras: `src/stores/`
- Infraestrutura: `src/composables/api/21.js`, `src/composables/storage.js`, `src/router/`, `src/plugins/`
- Assets: `public/images/`, `public/sound/`
- Arquitetura: `docs/arquitetura.md`

## Checklist de revisão da spec

Antes de implementar, confirme:

- o problema está claro;
- o escopo e os não objetivos foram definidos;
- estados de erro, loading e vazio foram considerados quando houver UI;
- mudanças de API ou persistência têm contrato explícito;
- critérios de aceite são testáveis;
- há testes unitários planejados para cada nova funcionalidade ou regra alterada;
- riscos de segurança foram considerados, especialmente por causa de credenciais e tokens em `localStorage`;
- há plano de verificação com comandos reais do projeto.
