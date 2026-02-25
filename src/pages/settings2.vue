<template>

  <!-- <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">

    <v-list>
      <v-list-item>
        <template v-slot:prepend>
          <v-avatar v-if="rail" image="/favicon.ico"></v-avatar>
        </template>

<v-img v-if="!rail" width="100" src="/images/logo.png" cover></v-img>

<template v-slot:append>
          <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
        </template>
</v-list-item>
</v-list>

<v-divider></v-divider>

<v-list density="compact" nav>

  <v-btn v-if="rail" :to="{ name: 'home' }" icon="mdi-chevron-left" size="small" variant="tonal"
    color="primary"></v-btn>

  <v-btn v-else :to="{ name: 'home' }" prepend-icon="mdi-chevron-left" variant="tonal" color="primary" block>
    {{ $t('menu.go_back') }}
  </v-btn>

</v-list>

<v-divider></v-divider>

<v-list density="compact" nav>

  <v-list-item prepend-icon="mdi-cog" title="Configurações" value="myfiles"></v-list-item>

</v-list>

<template #append>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-github" title="NovoSGA Web Panel"
          href="https://github.com/WilliamSampaio/novosga-web-panel" target="_blank"></v-list-item>
      </v-list>
    </template>

</v-navigation-drawer> -->

  <v-main>
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">

          <v-card class="mb-5" prepend-icon="mdi-server-outline" title="Servidor" subtitle="Conexão com o servidor.">
            <v-divider></v-divider>

            <v-card-text>

              <v-select v-model="serverStore.apiVersion" :items="[
                { value: '21', title: 'NovoSGA v2.1' },
                { value: '22', title: 'NovoSGA v2.2' },
              ]" density="compact" label="Versão do NovoSGA" prepend-icon="mdi-source-branch" clearable></v-select>

              <div v-if="serverStore.apiVersion !== null && serverStore.apiVersion === '21'">

                <v-text-field v-model="serverStore.apiUrl" label="URL do Servidor" prepend-icon="mdi-server"
                  density="compact" clearable></v-text-field>

                <v-text-field v-model="serverStore.apiUsername" label="Usuário da API" prepend-icon="mdi-account"
                  density="compact" clearable></v-text-field>

                <v-text-field v-model="serverStore.apiPassword" label="Senha da API" prepend-icon="mdi-lock"
                  density="compact" clearable type="password"></v-text-field>

                <v-text-field v-model="serverStore.apiClientId" label="Client ID da API" prepend-icon="mdi-application"
                  density="compact" clearable></v-text-field>

                <v-text-field v-model="serverStore.apiToken" label="Client Secret da API" prepend-icon="mdi-shield-key"
                  density="compact" clearable></v-text-field>

                <v-text-field v-model="serverStore.apiRetries" label="Número de tentativas em caso de falha"
                  prepend-icon="mdi-repeat" density="compact" clearable type="number"></v-text-field>

              </div>

              <div v-else-if="serverStore.apiVersion !== null && serverStore.apiVersion === '22'">
                <v-alert type="warning" variant="tonal" density="comfortable">
                  Ainda não foi implementado o suporte para o NovoSGA v2.2. Aguarde por favor (ou melhor, implemente
                  você mesmo!).
                </v-alert>
              </div>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-connection" variant="flat" size="large" color="primary"
                @click="saveServerSettings">
                Salvar e Conectar
              </v-btn>
            </v-card-actions>

          </v-card>

          <v-card class="mb-5" prepend-icon="mdi-panorama-outline" title="Painel" subtitle="Configurações do Painel.">
            <v-divider></v-divider>

            <v-card-text class="pa-0">

              <PanelPreview />

            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>

              <v-text-field v-model="panelStore.header.leftLogoUrl" label="Logo URL do cabeçalho"
                prepend-icon="mdi-image" density="compact" clearable>

                <template v-slot:append>
                  <DialogGetImageUrlFromCustom @select="(imagePath) => panelStore.header.leftLogoUrl = imagePath" />
                </template>

              </v-text-field>

              <v-text-field v-model="panelStore.footer.leftLogoUrl" label="Logo URL do rodapé (esquerda)"
                prepend-icon="mdi-image" density="compact" clearable>

                <template v-slot:append>
                  <DialogGetImageUrlFromCustom @select="(imagePath) => panelStore.footer.leftLogoUrl = imagePath" />
                </template>

              </v-text-field>

              <v-text-field v-model="panelStore.footer.rightLogoUrl" label="Logo URL do rodapé (direita)"
                prepend-icon="mdi-image" density="compact" clearable>

                <template v-slot:append>
                  <DialogGetImageUrlFromCustom @select="(imagePath) => panelStore.footer.rightLogoUrl = imagePath" />
                </template>

              </v-text-field>

              <v-switch v-model="panelStore.footer.showClock" prepend-icon="mdi-clock-digital"
                label="Exibir data e hora no rodapé" density="compact">
              </v-switch>

              <v-switch v-model="panelStore.main.historyShowLocal"
                prepend-icon="mdi-arrow-top-right-thin-circle-outline" label="Exibir local no histórico"
                density="compact">
              </v-switch>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>

              <v-row>
                <v-col cols="4">
                  <ColorInput id="header.bgColor" v-model="panelStore.header.bgColor" label="Fundo do Cabeçalho" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="header.textColor" v-model="panelStore.header.textColor" label="Texto do Cabeçalho" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.bgColor" v-model="panelStore.main.bgColor" label="Fundo do Painel Principal" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.ticketLabelColor" v-model="panelStore.main.ticketLabelColor"
                    label="Cor do Rótulo do Ticket" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.ticketColor" v-model="panelStore.main.ticketColor" label="Texto do Ticket" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.ticketPriorityColor" v-model="panelStore.main.ticketPriorityColor"
                    label="Cor da Prioridade do Ticket" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.serviceColor" v-model="panelStore.main.serviceColor" label="Texto do Serviço" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.localColor" v-model="panelStore.main.localColor" label="Texto do Local" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.historyBgColor" v-model="panelStore.main.historyBgColor"
                    label="Fundo do Histórico" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.historyLabelColor" v-model="panelStore.main.historyLabelColor"
                    label="Texto do Histórico" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="main.historyEmptyColor" v-model="panelStore.main.historyEmptyColor"
                    label="Texto do Histórico Vazio" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="footer.bgColor" v-model="panelStore.footer.bgColor" label="Fundo do Rodapé" />
                </v-col>

                <v-col cols="4">
                  <ColorInput id="footer.textColor" v-model="panelStore.footer.textColor" label="Texto do Rodapé" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { watch } from 'vue'
import { useServerStore } from '@/stores/server'
import { usePanelStore } from '@/stores/panel'
import { useMessagesStore } from '@/stores/messages'
import PanelPreview from '@/components/PanelPreview.vue'
import DialogGetImageUrlFromCustom from '@/components/DialogGetImageUrlFromCustom.vue'
import ColorInput from '@/components/ColorInput.vue'

// const drawer = ref(true)
// const rail = ref(false)

const serverStore = useServerStore()

const panelStore = usePanelStore()

const messages = useMessagesStore()

const saveServerSettings = () => {
  try {
    serverStore.save()
    messages.add({ text: 'Configurações do servidor salvas com sucesso!', color: 'success' })
  } catch (error) {
    messages.add({ text: 'Erro ao salvar as configurações do servidor: ' + error.message, color: 'error' })
  }
}

let timer = null

watch(
  () => panelStore.$state,
  () => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      panelStore.save()
      messages.add({ text: 'Configurações salvas com sucesso!', color: 'success' })
    }, 2000)
  },
  { deep: true }
)

</script>
