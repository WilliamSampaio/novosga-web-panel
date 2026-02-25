<template>
  <div class="container is-fluid">
    <div class="columns is-mobile">
      <div class="column is-2-desktop is-3-tablet is-3-mobile">
        <aside class="menu">
          <img src="/images/logo.png" alt="Novo SGA" />
          <hr />
          <router-link to="/" class="button is-light is-fullwidth mb-4">
            <span class="icon"><i class="fa fa-chevron-left"></i></span>
            <span>{{ $t('menu.go_back') }}</span>
          </router-link>

          <p class="menu-label">{{ $t('menu.general') }}</p>
          <ul class="menu-list">
            <li>
              <a @click="tab = 'interface'" :class="{ 'is-active': tab === 'interface' }">
                {{ $t('menu.interface') }}
              </a>
            </li>
            <li>
              <a @click="tab = 'server'" :class="{ 'is-active': tab === 'server' }">
                {{ $t('menu.server') }}
              </a>
            </li>
            <li v-if="settingsStore.unities.length">
              <a @click="tab = 'services'" :class="{ 'is-active': tab === 'services' }">
                {{ $t('menu.services') }}
              </a>
            </li>
            <li>
              <a @click="tab = 'sound'" :class="{ 'is-active': tab === 'sound' }">
                {{ $t('menu.sound') }}
              </a>
            </li>
          </ul>
        </aside>
      </div>

      <div class="column is-10-desktop is-9-tablet is-9-mobile">
        <div class="heading">
          <h1 class="title">{{ $t('settings.title') }}</h1>
          <h2 class="subtitle">
            {{ $t('settings.subtitle') }}
          </h2>
        </div>
        <hr />

        <form @submit.prevent="save" v-if="tab === 'interface'">
          <div class="columns">
            <div class="column is-6">
              <div class="field">
                <label class="label">{{ $t('settings.label.locale') }}</label>
                <div class="control has-icons-left">
                  <span class="select is-fullwidth">
                    <select v-model="selectedLocale" @change="setLocale">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="pt_BR">Português (Brasil)</option>
                    </select>
                  </span>
                  <span class="icon is-left"><i class="fa fa-globe"></i></span>
                </div>
              </div>
            </div>
            <div class="column is-6">
              <div class="field">
                <label class="label">{{ $t('settings.label.theme') }}</label>
                <div class="control has-icons-left">
                  <span class="select is-fullwidth">
                    <select v-model="form.theme" @change="form.themeOptions = {}">
                      <option v-for="t in settingsStore.availableThemes" :key="t.id" :value="t.id">
                        {{ t.name }}
                      </option>
                    </select>
                  </span>
                  <span class="icon is-left"><i class="fa fa-paint-brush"></i></span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedTheme?.options?.length">
            <h3 class="title is-4 mt-5">
              {{ $t('settings.interface.theme_options') }}
            </h3>
            <div class="field" v-for="opt in selectedTheme.options" :key="opt.name">
              <label class="label">{{ $t ? $t(opt.i18n) : 'Opções do Tema' }}</label>
              <div class="control">
                <input :type="opt.type" :placeholder="opt.placeholder" v-model="form.themeOptions[opt.name]"
                  class="input" />
              </div>
            </div>
          </div>

          <h3 class="title is-4 mt-5">
            {{ $t('settings.label.interface_colors') }}
          </h3>
          <div class="columns is-multiline">
            <div class="column is-3" v-for="colorKey in colorFields" :key="colorKey">
              <label class="label is-small">{{ colorKey }}</label>
              <input class="input is-small" type="color" v-model="form[colorKey]" />
            </div>
          </div>

          <SaveButton />
        </form>

        <form @submit.prevent="save" v-if="tab === 'server'">
          <div class="field">
            <label class="label">{{ $t('settings.label.server_url') }}</label>
            <input class="input" type="url" v-model="form.server" @change="onServerChange" />
          </div>
          <div class="field">
            <label class="label">{{ $t('settings.label.api_user') }}</label>
            <input class="input" type="text" v-model="form.username" />
          </div>
          <div class="field">
            <label class="label">{{ $t('settings.label.api_password') }}</label>
            <input class="input" type="password" v-model="form.password" />
          </div>
          <div class="field">
            <label class="label">{{ $t('settings.label.client_id') }}</label>
            <input class="input" type="text" v-model="form.clientId" />
          </div>
          <div class="field">
            <label class="label">{{ $t('settings.label.client_secret') }}</label>
            <input class="input" type="password" v-model="form.clientSecret" />
          </div>
          <SaveButton />
        </form>

        <form @submit.prevent="save" v-if="tab === 'services'">
          <div class="field">
            <label class="label">{{ $t('settings.label.unity') }}</label>
            <div class="select is-fullwidth">
              <select v-model="form.unity" @change="loadServices">
                <option :value="null">{{ $t('settings.label.select_unity') }}</option>
                <option v-for="u in settingsStore.unities" :key="u.id" :value="u.id">
                  {{ u.nome }}
                </option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">{{ $t('settings.label.services_to_display_dashboard') }}</label>
            <div class="box" style="max-height: 300px; overflow-y: auto">
              <div v-for="s in settingsStore.services" :key="s.servico.id">
                <label class="checkbox">
                  <input type="checkbox" :value="s.servico.id" v-model="form.services" />
                  {{ s.sigla }} - {{ s.servico.nome }}
                </label>
              </div>
              <p v-if="!settingsStore.services.length" class="has-text-grey">
                {{ $t('settings.label.no_service_available') }}.
              </p>
            </div>
          </div>
          <SaveButton />
        </form>

        <form @submit.prevent="save" v-if="tab === 'sound'">
          <div class="field has-addons">
            <div class="control is-expanded">
              <div class="select is-fullwidth">
                <select v-model="form.alert">
                  <option v-for="(file, name) in alertsAvailable" :key="file" :value="file">
                    {{ name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="control">
              <button type="button" class="button is-primary" @click="testAlert">
                {{ $t('settings.btn.test_alert') }} &nbsp; <i class="fa fa-play"></i>
              </button>
            </div>
          </div>
          <div class="field">
            <label class="checkbox">
              <input type="checkbox" v-model="form.speech" />
              {{ $t('settings.label.enable_speech') }}
            </label>
            <button type="button" class="button is-small is-ghost" @click="testSpeech">
              {{ $t('settings.btn.test_speech') }} &nbsp; <i class="fa fa-play"></i>
            </button>
          </div>
          <SaveButton />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, watch, onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { useSettingsStore } from '@/stores/settings'
import { useAlert } from '@/composables/audio'
import { useSpeech } from '@/composables/speech'
import { useI18n } from 'vue-i18n'
import SaveButton from '@/components/SaveButton.vue'
import storage from '@/composables/storage'
import { useAuthStoreOld } from '@/stores/authOld'

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

// // Componente interno para o botão de salvar (DRY)
// const SaveButton = {
//   template: `
//     <div class="field is-grouped is-grouped-right mt-5">
//       <button type="submit" class="button is-primary is-large">
//         Salvar Configurações &nbsp; <i class="fa fa-save"></i>
//       </button>
//     </div>
//   `
// }

const mainStore = useMainStore()
const authStore = useAuthStoreOld()
const settingsStore = useSettingsStore()
const { playAlert, alertsAvailable } = useAlert()
const { speakAll } = useSpeech()

// Injetar o SweetAlert se estiver usando o plugin vue-sweetalert2
// const $swal = inject('$swal')

const tab = ref('interface')
const form = reactive({})
const initialCredentials = reactive({ clientId: '', clientSecret: '', username: '', password: '' })

// Mapeamento dos campos de cores para o loop no template
const colorFields = [
  'pageBgColorNormal',
  'pageFontColorNormal',
  'pageBgColorPriority',
  'pageFontColorPriority',
  'featuredFontColorNormal',
  'featuredFontColorPriority',
  'historyFontColorNormal',
  'historyFontColorPriority',
  'sidebarBgColorNormal',
  'sidebarFontColorNormal',
  'sidebarBgColorPriority',
  'sidebarFontColorPriority',
  'footerBgColorNormal',
  'footerFontColorNormal',
  'footerBgColorPriority',
  'footerFontColorPriority',
  'clockBgColorNormal',
  'clockFontColorNormal',
  'clockBgColorPriority',
  'clockFontColorPriority',
]

const selectedTheme = computed(() => settingsStore.availableThemes.find((t) => t.id === form.theme))

const isCredentialChanged = computed(
  () =>
    initialCredentials.clientId !== form.clientId ||
    initialCredentials.clientSecret !== form.clientSecret ||
    initialCredentials.username !== form.username ||
    initialCredentials.password !== form.password,
)

const loadDataFromStore = () => {
  // Deep copy do estado atual da store para o formulário local
  Object.assign(form, JSON.parse(JSON.stringify(mainStore.config)))

  // Garantir defaults
  form.theme = form.theme || 'novosga.default'
  form.themeOptions = form.themeOptions || {}
  form.services = form.services || []
  form.alert = form.alert || alertsAvailable.Default

  // Guardar credenciais originais para detectar mudanças
  initialCredentials.clientId = form.clientId
  initialCredentials.clientSecret = form.clientSecret
  initialCredentials.username = form.username
  initialCredentials.password = form.password
}

const onServerChange = () => {
  form.unity = null
  settingsStore.unities = []
  settingsStore.services = []
}

const loadServices = () => {
  if (form.unity) settingsStore.fetchServices(form.unity)
}

const save = async () => {
  try {
    mainStore.updateConfig(form)

    // Se as credenciais mudaram ou o token expirou, tenta re-autenticar
    if (!authStore.isAuthenticated || authStore.isExpired || isCredentialChanged.value) {
      await authStore.token()
    }

    // Após autenticar, recarrega unidades se necessário
    if (form.server && settingsStore.unities.length === 0) {
      await settingsStore.fetchUnities()
    }

    // if ($swal) $swal('Sucesso', 'Configurações salvas com sucesso!', 'success')
    alert('Configurações salvas com sucesso!')
    loadDataFromStore()
  } catch (error) {
    // if ($swal) $swal('Erro', error.message || error, 'error')
    alert('Erro ao salvar configurações: ' + (error.message || error))
  }
}

const testAlert = () => playAlert(form.alert)
const testSpeech = () => speakAll(['Senha', 'A', '100', 'Guichê', '1'], selectedLocale.value)

onBeforeMount(async () => {
  loadDataFromStore()

  if (authStore.isAuthenticated) {
    if (authStore.isExpired) await authStore.refresh().catch(() => {
      //
    })
    if (form.server) {
      settingsStore.fetchUnities()
      if (form.unity) settingsStore.fetchServices(form.unity)
    }
  }
})
</script>

<style scoped lang="scss">
aside img {
  width: 100%;
  max-height: 60px;
  object-fit: contain;
}

.column {
  padding: 1.5rem;
}

.menu-list a.is-active {
  background-color: #00d1b2;
  color: #fff;
}

.checkbox {
  display: block;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
</style>
