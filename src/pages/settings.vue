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
    <v-fab :to="{ name: 'home' }" :absolute="false" :app="true" color="success" location="top center" variant="flat"
      text="Ir para o Painel" append-icon="mdi-chevron-right" extended />

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
                  density="compact" clearable @change="() => clearUnitiesAndServices(true)"></v-text-field>

                <v-text-field v-model="serverStore.apiUsername" label="Usuário da API" prepend-icon="mdi-account"
                  density="compact" clearable></v-text-field>

                <v-text-field v-model="serverStore.apiPassword" label="Senha da API" prepend-icon="mdi-lock"
                  density="compact" clearable type="password"></v-text-field>

                <v-text-field v-model="serverStore.apiClientId" label="Client ID da API" prepend-icon="mdi-application"
                  density="compact" clearable></v-text-field>

                <v-text-field v-model="serverStore.apiClientSecret" label="Client Secret da API"
                  prepend-icon="mdi-shield-key" density="compact" clearable></v-text-field>

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

          <v-card class="mb-5" prepend-icon="mdi-server-outline" title="Serviços"
            subtitle="Configurações dos serviços e unidades.">
            <v-divider></v-divider>

            <v-card-text>

              <v-select v-model="settingsStore.currentUnity" :items="selectDataUnities" item-title="title"
                item-value="value" label="Unidade" prepend-icon="mdi-domain" density="compact" clearable
                @click:clear="() => clearUnitiesAndServices()" @update:model-value="loadServices">
              </v-select>

              <div v-if="settingsStore.services.length > 0">

                <v-switch color="info" v-for="(s, index) in settingsStore.services" :key="index"
                  v-model="settingsStore.enabledServices[index]" :label="`${index} - ${s.servico.nome}`"
                  density="compact">
                </v-switch>

              </div>

              <v-alert v-else type="info" variant="tonal" density="comfortable">
                Selecione a unidade e clique em "Buscar Serviços" para carregar os serviços disponíveis.
              </v-alert>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn append-icon="mdi-connection" variant="flat" size="large" color="primary"
                @click="settingsStore.save()">
                Salvar
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

              <v-switch color="info" v-model="panelStore.footer.showClock" prepend-icon="mdi-clock-digital"
                label="Exibir data e hora no rodapé" density="compact">
              </v-switch>

              <v-switch color="info" v-model="panelStore.main.historyShowLocal"
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

          <v-card class="mb-5" prepend-icon="mdi-volume-high" title="Audio" subtitle="Configurações de audio.">
            <v-divider></v-divider>

            <v-card-text>

              <v-select v-model="settingsStore.alertSound" :items="selectDataAlertAvailable" label="Som de alerta"
                prepend-icon="mdi-bell" density="compact" clearable>

                <template v-slot:append>

                  <v-btn variant="flat" color="success" append-icon="mdi-play" @click="testAlert"
                    :disabled="settingsStore.alertSound === null">
                    Ouvir
                  </v-btn>

                </template>

              </v-select>

              <v-switch color="info" v-model="settingsStore.speech" prepend-icon="mdi-account-voice"
                label="Exibir local no histórico" density="compact">

                <template v-slot:append>

                  <v-text-field v-model="speechTestString" label="Frase" placeholder="Digite algo aqui!" maxlength="24"
                    density="compact" class="w-96">

                    <template v-slot:append>
                      <v-btn variant="flat" color="success" append-icon="mdi-play" @click="testSpeech(speechTestString)"
                        :disabled="!speechTestString">
                        Ouvir
                      </v-btn>
                    </template>

                  </v-text-field>

                </template>

              </v-switch>

            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { usePanelStore } from '@/stores/panel'
import { useServerStore } from '@/stores/server'
import { useSettingsStore } from '@/stores/settings'
import PanelPreview from '@/components/PanelPreview.vue'
import DialogGetImageUrlFromCustom from '@/components/DialogGetImageUrlFromCustom.vue'
import ColorInput from '@/components/ColorInput.vue'
import { useI18n } from 'vue-i18n'
import storage from '@/composables/storage'
import { useAlert } from '@/composables/audio'
import { useSpeech } from '@/composables/speech'

// const drawer = ref(true)
// const rail = ref(false)

const selectDataUnities = computed(() => {
  return settingsStore.unities.map(
    u => ({
      value: u.id,
      title: `${u.id} - ${u.nome} (${u.descricao})`,
    })
  )
})

const selectDataAlertAvailable = computed(() => {
  return Object.entries(alertsAvailable).map(([name, file]) => ({
    title: name,
    value: file
  }));
})

const serverStore = useServerStore()

const authStore = useAuthStore()

const settingsStore = useSettingsStore()

const panelStore = usePanelStore()

const messages = useMessagesStore()

const { playAlert, alertsAvailable } = useAlert()
const { speakAll } = useSpeech()
const speechTestString = ref("Olá Mundo! A B C 0 1 2 3")

const saveServerSettings = async () => {
  try {
    serverStore.save()

    if (!authStore.isAuthenticated || authStore.isExpired) {
      await authStore.token()
    }

    await settingsStore.fetchUnities()

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

// Herança da antiga página de configurações. Precisa ser refatorada para o novo design.
const { locale } = useI18n()

const selectedLocale = ref(null)

watch(selectedLocale, (newLocaleValue) => {
  locale.value = newLocaleValue
  const config = storage.get('config') || {}
  storage.set('config', { ...config, locale: newLocaleValue })
})

onMounted(() => {
  const config = storage.get('config') || {}
  selectedLocale.value = config.locale || 'pt_BR'
})

const clearUnitiesAndServices = (clearCurrentUnities = false) => {
  settingsStore.currentUnity = null
  settingsStore.enabledServices = []
  if (clearCurrentUnities) settingsStore.unities = []
  settingsStore.services = []
  settingsStore.save()
}

const loadServices = () => {
  if (settingsStore.currentUnity) settingsStore.fetchServices(settingsStore.currentUnity)
}

const testAlert = () => playAlert(settingsStore.alertSound)
const testSpeech = (text) => speakAll([text], selectedLocale.value)

onBeforeMount(async () => {

  // Se já estiver autenticado, tenta atualizar o token e carregar as unidades e serviços
  if (authStore.isAuthenticated) {

    // Se o token estiver expirado, tenta atualizar. Se falhar, exibe mensagem de erro.
    if (authStore.isExpired) await authStore.refresh().catch(() => {
      messages.add({ text: 'Sessão expirada. Faça login novamente.', color: 'error' })
    })

    // Se ainda estiver autenticado após tentar atualizar o token, carrega as unidades e serviços
    if (serverStore.apiUrl) {

      settingsStore.fetchUnities()
      if (settingsStore.currentUnity) settingsStore.fetchServices(settingsStore.currentUnity)
    }
  }
})
</script>
