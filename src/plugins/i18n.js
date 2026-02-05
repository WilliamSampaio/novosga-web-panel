import { createI18n } from 'vue-i18n'

// Exemplo importando os arquivos JSON (ajuste o caminho se necessário)
import pt_BR from '../locales/pt_BR.json'
import en from '../locales/en.json'
import es from '../locales/es.json'

const i18n = createI18n({
  legacy: false, // Define como 'false' para usar Composition API (recomendado)
  locale: 'pt_BR',
  fallbackLocale: 'en',
  globalInjection: true, // Isso permite que o $t funcione no template como no Vue 2
  messages: {
    pt_BR,
    en,
    es,
  },
})

export default i18n
