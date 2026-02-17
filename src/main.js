import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useMainStore } from './stores/main'
import i18n from './plugins/i18n'
import pinia from './plugins/pinia'

import 'moment/dist/locale/pt-br'

import 'bulma/css/bulma.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './style.css'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(pinia)

// Inicialização de estado
const mainStore = useMainStore()
if (mainStore.config.locale) {
  // Isso dispara a carga do dicionário JSON que convertemos no store/main.js
  mainStore.updateConfig(mainStore.config)
}

app.mount('#app')
