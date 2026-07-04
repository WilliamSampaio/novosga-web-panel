# Inventário de textos da internacionalização

Este inventário atende à Task 1 da spec
`docs/sdd/0001-internacionalizacao-interface.md`: mapear textos visíveis hardcoded e separar o que
fica fora do escopo antes de alterar código de produção.

## Textos visíveis a internacionalizar

### `src/pages/settings.vue`

- Diálogo de idioma:
  - `fechar`
- Diálogo de tema:
  - `Modo escuro`
  - `fechar`
- Botão de retorno ao painel:
  - `Ir para o Painel`
- Card Servidor:
  - `Conexão com o servidor.`
  - `Versão do NovoSGA`
  - `URL do Servidor`
  - `Usuário da API`
  - `Senha da API`
  - `Client ID da API`
  - `Client Secret da API`
  - `Número de tentativas em caso de falha`
  - `Salvar e Conectar`
- Alerta comentado do NovoSGA 2.2, caso seja reativado:
  - `Ainda não foi implementado o suporte para o NovoSGA v2.2. Aguarde por favor (ou melhor,
    implemente você mesmo!).`
- Card Serviços:
  - `Serviços`
  - `Configurações dos serviços e unidades.`
  - `Unidade`
  - `Marcar Todos`
  - `Selecione a unidade e clique em "Buscar Serviços" para carregar os serviços disponíveis.`
- Card Painel:
  - `Painel`
  - `Configurações do Painel.`
  - `Modelo do painel`
  - `Logo URL do cabeçalho`
  - `Logo URL do rodapé (esquerda)`
  - `Logo URL do rodapé (direita)`
  - `Exibir data e hora no rodapé`
  - `Exibir local no histórico`
  - `Fundo do Cabeçalho`
  - `Texto do Cabeçalho`
  - `Fundo do Painel Principal`
  - `Cor do Rótulo do Ticket`
  - `Texto do Ticket`
  - `Cor da Prioridade do Ticket`
  - `Texto do Serviço`
  - `Texto do Local`
  - `Fundo do Histórico`
  - `Texto do Histórico`
  - `Texto do Histórico Vazio`
  - `Fundo do Rodapé`
  - `Texto do Rodapé`
- Card Audio/Fala:
  - `Audio`
  - `Configurações de audio.`
  - `Som de alerta`
  - `Ouvir`
  - `Ativar vocalização`
  - `Frase`
  - `Digite algo aqui!`
  - `Olá Mundo! A B C 0 1 2 3`
- Área crítica:
  - `Área Crítica`
  - `Redefinir este painel para o estado de fábrica`
  - `Ao confirmar, todas as preferências de cores, logos, URLs de API e templates de fala
    armazenados neste navegador serão apagados permanentemente.`
- Mensagens exibidas via store de mensagens:
  - `Configurações do servidor salvas com sucesso!`
  - `Erro ao salvar as configurações do servidor: {message}`
  - `Configurações salvas com sucesso!`
  - `Sessão expirada. Faça login novamente.`

### `src/components/DialogGetImageUrlFromCustom.vue`

- `Carregar da pasta custom`
- `Carregar imagem da pasta custom`
- `Selecione uma imagem da pasta custom para usar no painel.`
- `Duplo-clique para pegar a URL da imagem.`
- `Fechar`

### `src/components/ResetConfiguration.vue`

- `Redefinir Painel`
- `Atenção! Ação Crítica`
- `Você está prestes a limpar todos os dados locais deste painel.`
- `Esta ação irá:`
- `Remover templates de voz personalizados.`
- `Resetar cores e logos configuradas.`
- `Deslogar a sessão atual.`
- `Essa operação não pode ser desfeita.`
- `Manter Configurações`
- `Sim, Redefinir Tudo`

### `src/components/SpeechTextEditor.vue`

- `Template da chamada`
- `Ouvir`
- Exemplo de local usado no teste de fala:
  - `Guichê`

### `src/components/panels/Default/Preview.vue`

- Labels dos controles do preview:
  - `Painel vazio`
  - `Ocultar nome do cliente`
  - `Senha atual prioridade`
  - `Histórico vazio`
- Dados simulados visíveis no preview:
  - `minha unidade`
  - `james bond`
  - `descrição do serviço`
  - `guichê 1`
  - `guichê 2`
  - `guichê 3`

### `src/components/panels/Model001/Preview.vue`

- Labels dos controles do preview:
  - `Painel vazio`
  - `Nome do cliente não informado`
  - `Senha atual prioridade`
  - `Histórico vazio`
- Dados simulados visíveis no preview:
  - `minha unidade`
  - `james bond`
  - `maria bonita`
  - `virgulino`
  - `fulano de tal`
  - `ana bolinha`
  - `severino`
  - `luva de pedreiro`
  - `descrição do serviço`
  - `guichê 1`

### `src/stores/settings.js`

- Mensagem exibida quando a API não retorna serviços:
  - `Nenhum serviço enocontrado!`

Observação: a implementação deve corrigir o texto para `Nenhum serviço encontrado!` em `pt_BR`.

### `src/stores/auth.js`

- Erros que podem chegar à interface:
  - `Configurações de API incompletas no servidor.`
  - `Nenhum Refresh Token disponível.`

### `src/composables/api/21.js`

- Erro genérico que pode chegar à interface:
  - `Erro desconhecido na API`

## Já internacionalizado ou sem pendência visível

- `src/components/GoToSettingsButton.vue`: usa `$t('menu.settings')`.
- `src/components/ColorInput.vue`: recebe `label` por prop; os textos vêm do componente pai.
- `src/components/Clock.vue`: usa `Intl.DateTimeFormat` com locale recebido por prop; não possui
  texto fixo visível além de separadores de hora.
- `src/components/panels/Default/History.vue`: usa `$t('panel.history.title')` e
  `$t('panel.empty')`.
- `src/components/panels/Default/Panel.vue`: usa `t('panel.ticket')`,
  `t('panel.priority')` e `$t('panel.empty')`.
- `src/components/panels/Model001/History.vue`: usa `$t('panel.history.title')` e
  `$t('panel.empty')`.
- `src/components/panels/Model001/Panel.vue`: usa `t('panel.ticket')`,
  `t('panel.priority')` e `$t('panel.empty')`.
- `src/components/panels/PanelLoader.vue`: sem texto visível identificado.
- `src/stores/panel.js`: já usa `i18n.global.t` para `panel.ticket` no texto de fala.

## Fora do escopo da internacionalização

- Comentários de código em português, por não serem visíveis ao usuário final.
- Logs técnicos em `src/pages/home.vue`, porque usam `log(...)` para diagnóstico e não aparecem
  como texto normal da interface.
- `console.error(...)` em composables e painéis, por serem mensagens técnicas de console.
- Nomes de unidade, serviço, local, cliente e senha vindos da API do NovoSGA.
- Labels de serviços montados com `${s.servico.id} - ${s.servico.nome}`, porque usam dados vindos
  da API.
- Nomes de arquivos de imagens customizadas exibidos em
  `src/components/DialogGetImageUrlFromCustom.vue`, porque representam assets do usuário.

## Pontos a decidir antes das próximas tasks

- Definir se os dados simulados dos previews devem ser traduzidos ou substituídos por exemplos
  neutros por locale.
- Definir a tradução de `panel.ticket` em espanhol para evitar ambiguidade entre `Turno`,
  `Ticket`, `Número` ou outro termo de domínio.
- Definir como mensagens técnicas vindas da API devem aparecer para o usuário: texto genérico
  traduzido com detalhe original, ou somente detalhe original.
