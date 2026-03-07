<template>
  <v-navigation-drawer permanent rail>
    <v-list>
      <v-list-item class="pa-0 text-center">
        <v-avatar image="/favicon.ico" size="40"></v-avatar>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list class="text-center" density="compact" nav>
      <v-dialog max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
          <v-icon v-bind="activatorProps" size="large">mdi-translate</v-icon>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-card-text class="flex flex-column justify-center">
              <v-select
                v-model="settingsStore.locale"
                :items="settingsStore.getLocales"
                item-title="title"
                item-value="value"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon size="large">mdi-translate</v-icon>
                </template>
              </v-select>
              <v-btn
                :text="$t('common.close')"
                variant="flat"
                color="primary"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-list>

    <v-divider></v-divider>

    <v-list class="text-center" density="compact" nav>
      <v-dialog max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
          <v-icon v-bind="activatorProps" size="large">
            {{ settingsStore.darkTheme ? 'mdi-brightness-4' : 'mdi-brightness-6' }}
          </v-icon>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card>
            <v-card-text class="flex flex-column justify-center">
              <v-switch
                class="mx-auto"
                :label="$t('settings.dark_mode')"
                density="compact"
                v-model="settingsStore.darkTheme"
              >
                <template v-slot:prepend>
                  <v-icon size="large">mdi-brightness-6</v-icon>
                </template>
              </v-switch>
              <v-btn
                :text="$t('common.close')"
                variant="flat"
                color="primary"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-list>

    <template #append>
      <v-list class="text-center" density="compact" nav>
        <v-icon size="large" @click="openGitHub">mdi-github</v-icon>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-main>
    <v-fab
      :to="{ name: 'home' }"
      :absolute="false"
      :app="true"
      color="success"
      location="top center"
      variant="flat"
      :text="$t('menu.go_to_panel')"
      append-icon="mdi-chevron-right"
      extended
    />

    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <v-card
            class="mb-5"
            prepend-icon="mdi-server-outline"
            :title="$t('menu.server')"
            :subtitle="$t('settings.server_subtitle')"
          >
            <v-divider></v-divider>

            <v-card-text>
              <v-select
                v-model="serverStore.apiVersion"
                :items="[
                  { value: '21', title: 'NovoSGA v2.1' },
                  { value: '22', title: 'NovoSGA v2.2' },
                ]"
                density="compact"
                :label="$t('settings.version')"
                prepend-icon="mdi-source-branch"
                clearable
              ></v-select>

              <div v-if="serverStore.apiVersion !== null && serverStore.apiVersion === '21'">
                <v-text-field
                  v-model="serverStore.apiUrl"
                  :label="$t('settings.url')"
                  prepend-icon="mdi-server"
                  density="compact"
                  clearable
                  @change="() => clearUnitiesAndServices(true)"
                ></v-text-field>

                <v-text-field
                  v-model="serverStore.apiUsername"
                  :label="$t('settings.user')"
                  prepend-icon="mdi-account"
                  density="compact"
                  clearable
                ></v-text-field>

                <v-text-field
                  v-model="serverStore.apiPassword"
                  :label="$t('settings.password')"
                  prepend-icon="mdi-lock"
                  density="compact"
                  clearable
                  type="password"
                ></v-text-field>

                <v-text-field
                  v-model="serverStore.apiClientId"
                  :label="$t('settings.client_id')"
                  prepend-icon="mdi-application"
                  density="compact"
                  clearable
                ></v-text-field>

                <v-text-field
                  v-model="serverStore.apiClientSecret"
                  :label="$t('settings.client_secret')"
                  prepend-icon="mdi-shield-key"
                  density="compact"
                  clearable
                ></v-text-field>

                <v-text-field
                  v-model="serverStore.apiRetries"
                  :label="$t('settings.retries')"
                  prepend-icon="mdi-repeat"
                  density="compact"
                  clearable
                  type="number"
                ></v-text-field>
              </div>

              <div v-else-if="serverStore.apiVersion !== null && serverStore.apiVersion === '22'">
                <v-alert type="warning" variant="tonal" density="comfortable">
                  {{ $t('settings.v22_warning') }}
                </v-alert>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                append-icon="mdi-connection"
                variant="flat"
                size="large"
                color="primary"
                @click="saveServerSettings"
              >
                {{ $t('settings.btn_save_connect') }}
              </v-btn>
            </v-card-actions>
          </v-card>

          <v-card
            class="mb-5"
            prepend-icon="mdi-server-outline"
            :title="$t('menu.services')"
            :subtitle="$t('settings.services_subtitle')"
          >
            <v-divider></v-divider>

            <v-card-text>
              <v-select
                v-model="settingsStore.currentUnity"
                :items="selectDataUnities"
                item-title="title"
                item-value="value"
                :label="$t('settings.unity')"
                prepend-icon="mdi-domain"
                density="compact"
                clearable
                @click:clear="() => clearUnitiesAndServices()"
                @update:model-value="loadServices"
              >
              </v-select>

              <div v-if="settingsStore.services.length > 0">
                <v-switch
                  :label="$t('settings.select_all')"
                  v-model="toggleAllServices"
                  color="info"
                  density="compact"
                  :disabled="disabledToogleAllServices"
                ></v-switch>

                <v-switch
                  v-for="s in settingsStore.services"
                  :key="s.servico.id"
                  :label="`${s.servico.id} - ${s.servico.nome}`"
                  :value="s.servico.id"
                  v-model="settingsStore.enabledServices"
                  color="info"
                  density="compact"
                ></v-switch>
              </div>

              <v-alert v-else type="info" variant="tonal" density="comfortable">
                {{ $t('settings.no_services_found') }}
              </v-alert>
            </v-card-text>
          </v-card>

          <v-card
            class="mb-5"
            prepend-icon="mdi-panorama-outline"
            :title="$t('menu.panel')"
            :subtitle="$t('settings.panel_subtitle')"
          >
            <v-divider></v-divider>

            <v-card-text>
              <v-select
                v-model="panelStore.panel.model"
                :items="panelStore.listPanelModels"
                :label="$t('settings.panel_model')"
                prepend-icon="mdi-panorama-outline"
                density="compact"
              >
              </v-select>
            </v-card-text>

            <v-card-text class="pa-0">
              <PanelLoader :panel="panelStore.panel.model" :is-preview="true" />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
              <v-text-field
                v-model="panelStore.header.leftLogoUrl"
                :label="$t('settings.logo_header')"
                prepend-icon="mdi-image"
                density="compact"
                clearable
              >
                <template v-slot:append>
                  <DialogGetImageUrlFromCustom
                    v-if="settingsStore.devMode"
                    @select="(imagePath) => (panelStore.header.leftLogoUrl = imagePath)"
                  />
                </template>
              </v-text-field>

              <v-text-field
                v-model="panelStore.footer.leftLogoUrl"
                :label="$t('settings.logo_footer_left')"
                prepend-icon="mdi-image"
                density="compact"
                clearable
              >
                <template v-slot:append>
                  <DialogGetImageUrlFromCustom
                    v-if="settingsStore.devMode"
                    @select="(imagePath) => (panelStore.footer.leftLogoUrl = imagePath)"
                  />
                </template>
              </v-text-field>

              <v-text-field
                v-model="panelStore.footer.rightLogoUrl"
                :label="$t('settings.logo_footer_right')"
                prepend-icon="mdi-image"
                density="compact"
                clearable
              >
                <template v-slot:append>
                  <DialogGetImageUrlFromCustom
                    v-if="settingsStore.devMode"
                    @select="(imagePath) => (panelStore.footer.rightLogoUrl = imagePath)"
                  />
                </template>
              </v-text-field>

              <v-switch
                color="info"
                v-model="panelStore.footer.showClock"
                prepend-icon="mdi-clock-digital"
                :label="$t('settings.show_clock')"
                density="compact"
              >
              </v-switch>

              <v-switch
                color="info"
                v-model="panelStore.main.historyShowLocal"
                prepend-icon="mdi-arrow-top-right-thin-circle-outline"
                :label="$t('settings.show_local_history')"
                density="compact"
              >
              </v-switch>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>
              <v-row>
                <v-col cols="4">
                  <ColorInput
                    id="header.bgColor"
                    v-model="panelStore.header.bgColor"
                    :label="$t('labels.header_bg')"
                  />
                </v-col>
                <v-col cols="4">
                  <ColorInput
                    id="header.textColor"
                    v-model="panelStore.header.textColor"
                    :label="$t('labels.header_text')"
                  />
                </v-col>
                <v-col cols="4">
                  <ColorInput
                    id="main.bgColor"
                    v-model="panelStore.main.bgColor"
                    :label="$t('labels.main_bg')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.ticketLabelColor"
                    v-model="panelStore.main.ticketLabelColor"
                    :label="$t('labels.ticket_label')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.ticketColor"
                    v-model="panelStore.main.ticketColor"
                    :label="$t('labels.ticket_text')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.ticketPriorityColor"
                    v-model="panelStore.main.ticketPriorityColor"
                    :label="$t('labels.ticket_priority')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.serviceColor"
                    v-model="panelStore.main.serviceColor"
                    :label="$t('labels.service_text')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.localColor"
                    v-model="panelStore.main.localColor"
                    :label="$t('labels.local_text')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.historyBgColor"
                    v-model="panelStore.main.historyBgColor"
                    :label="$t('labels.history_bg')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.historyLabelColor"
                    v-model="panelStore.main.historyLabelColor"
                    :label="$t('labels.history_text')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="main.historyEmptyColor"
                    v-model="panelStore.main.historyEmptyColor"
                    :label="$t('labels.history_empty')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="footer.bgColor"
                    v-model="panelStore.footer.bgColor"
                    :label="$t('labels.footer_bg')"
                  />
                </v-col>

                <v-col cols="4">
                  <ColorInput
                    id="footer.textColor"
                    v-model="panelStore.footer.textColor"
                    :label="$t('labels.footer_text')"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card
            class="mb-5"
            prepend-icon="mdi-volume-high"
            :title="$t('menu.audio')"
            :subtitle="$t('settings.audio_subtitle')"
          >
            <v-divider></v-divider>

            <v-card-text>
              <v-select
                v-model="settingsStore.alertSound"
                :items="selectDataAlertAvailable"
                :label="$t('settings.alert_sound')"
                prepend-icon="mdi-bell"
                density="compact"
                clearable
              >
                <template v-slot:append>
                  <v-btn
                    variant="flat"
                    color="success"
                    append-icon="mdi-play"
                    @click="testAlert"
                    :disabled="settingsStore.alertSound === null"
                  >
                    {{ $t('common.listen') }}
                  </v-btn>
                </template>
              </v-select>

              <v-switch
                color="info"
                v-model="settingsStore.speech"
                prepend-icon="mdi-account-voice"
                :label="$t('settings.vocalization')"
                density="compact"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="speechTestString"
                    :label="$t('common.phrase')"
                    :placeholder="$t('common.type_here')"
                    maxlength="24"
                    density="compact"
                    class="w-96"
                  >
                    <template v-slot:append>
                      <v-btn
                        variant="flat"
                        color="success"
                        append-icon="mdi-play"
                        @click="testSpeech(speechTestString)"
                        :disabled="!speechTestString"
                      >
                        {{ $t('common.listen') }}
                      </v-btn>
                    </template>
                  </v-text-field>
                </template>
              </v-switch>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-text>
              <SpeechTextEditor />
            </v-card-text>
          </v-card>

          <v-card class="mb-8 border-error-thin" variant="outlined" elevation="0">
            <v-card-item class="bg-error-lighten-5">
              <template v-slot:prepend>
                <v-icon color="error">mdi-shield-alert-outline</v-icon>
              </template>
              <v-card-title class="text-error font-weight-bold">
                {{ $t('menu.critical_area') }}
              </v-card-title>
            </v-card-item>

            <v-card-text class="pa-6">
              <v-row no-gutters>
                <v-col cols="12" md="8">
                  <div class="text-subtitle-1 font-weight-bold mb-1">
                    {{ $t('settings.reset_title') }}
                  </div>
                  <p class="text-body-2 text-medium-emphasis">
                    {{ $t('settings.reset_desc') }}
                  </p>
                </v-col>

                <v-spacer></v-spacer>

                <v-col cols="12" md="auto" class="mt-4 mt-md-0">
                  <ResetConfiguration />
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
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useAlert } from '@/composables/audio'
import { useSpeech } from '@/composables/speech'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { usePanelStore } from '@/stores/panel'
import { useServerStore } from '@/stores/server'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from 'vue-i18n'
import ColorInput from '@/components/ColorInput.vue'
import DialogGetImageUrlFromCustom from '@/components/DialogGetImageUrlFromCustom.vue'
import PanelLoader from '@/components/panels/PanelLoader.vue'
import SpeechTextEditor from '@/components/SpeechTextEditor.vue'
import ResetConfiguration from '@/components/ResetConfiguration.vue'

const { t, locale } = useI18n()

const toggleAllServices = ref(false)

const selectDataUnities = computed(() => {
  return settingsStore.unities.map((u) => ({
    value: u.id,
    title: `${u.id} - ${u.nome} (${u.descricao})`,
  }))
})

const selectDataAlertAvailable = computed(() => {
  return Object.entries(alertsAvailable).map(([name, file]) => ({
    title: name,
    value: file,
  }))
})

const disabledToogleAllServices = computed(() => {
  if (
    settingsStore.enabledServices.length > 0 &&
    settingsStore.enabledServices.length !== settingsStore.services.length
  ) {
    return true
  }
  return false
})

const openGitHub = () => {
  window.open(
    'https://github.com/WilliamSampaio/novosga-web-panel',
    '_blank',
    'noopener,noreferrer',
  )
}

const serverStore = useServerStore()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const panelStore = usePanelStore()
const messages = useMessagesStore()

const { playAlert, alertsAvailable } = useAlert()
const { speakAll } = useSpeech()
const speechTestString = ref('Olá Mundo! A B C 0 1 2 3')

const saveServerSettings = async () => {
  try {
    serverStore.save()

    if (!authStore.isAuthenticated || authStore.isExpired) {
      await authStore.token()
    }

    await settingsStore.fetchUnities()

    messages.add({ text: t('settings.msg_server_save_success'), color: 'success' })
  } catch (error) {
    messages.add({
      text: t('common.error') + ': ' + error.message,
      color: 'error',
    })
  }
}

let timer = null

watch(
  () => panelStore.$state,
  () => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      panelStore.save()
      messages.add({ text: t('settings.msg_save_success'), color: 'success' })
    }, 2000)
  },
  { deep: true },
)

watch(
  () => settingsStore.$state,
  () => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      settingsStore.save()
      messages.add({ text: t('settings.msg_save_success'), color: 'success' })
    }, 2000)
  },
  { deep: true },
)

watch(toggleAllServices, (newValue) => {
  const allIds = settingsStore.services.map((i) => i.servico.id)

  if (newValue && settingsStore.enabledServices.length !== allIds.length) {
    settingsStore.enabledServices = allIds
  } else if (!newValue && settingsStore.enabledServices.length > 0) {
    settingsStore.enabledServices = []
  }
})

watch(
  () => settingsStore.locale,
  (newLocale) => {
    if (newLocale && locale.value !== newLocale) {
      locale.value = newLocale
    }
  },
  { immediate: true },
)

const clearUnitiesAndServices = (clearCurrentUnities = false) => {
  toggleAllServices.value = false
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
const testSpeech = (text) => speakAll([text], locale.value)

onBeforeMount(async () => {
  if (authStore.isAuthenticated) {
    if (authStore.isExpired)
      await authStore.refresh().catch(() => {
        messages.add({ text: t('settings.msg_session_expired'), color: 'error' })
      })

    if (serverStore.apiUrl) {
      settingsStore.fetchUnities()
      if (settingsStore.currentUnity) settingsStore.fetchServices(settingsStore.currentUnity)
    }
  }
})
</script>

<style scoped>
.border-error-thin {
  border: 1px solid rgba(var(--v-theme-error), 0.3) !important;
}
.bg-error-lighten-5 {
  background-color: rgba(var(--v-theme-error), 0.05);
}
</style>
