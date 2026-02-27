import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useSettingsStore } from './stores/settings'
import i18n from './plugins/i18n'
import pinia from './plugins/pinia'
import vuetify from './plugins/vuetify'

import 'moment/dist/locale/pt-br'

import './style.css'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(pinia)
app.use(vuetify)

const settingsStore = useSettingsStore()
if (!settingsStore.locale) {
  settingsStore.locale = 'pt_BR'
  settingsStore.save()
}

app.mount('#app')
