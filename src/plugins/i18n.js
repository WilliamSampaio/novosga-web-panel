import { createI18n } from 'vue-i18n'

// Exemplo importando os arquivos JSON (ajuste o caminho se necessário)
import ptBR from '../locales/pt-BR.json'
import enUS from '../locales/en-US.json'
import esES from '../locales/es-ES.json'

const i18n = createI18n({
  legacy: false, // Define como 'false' para usar Composition API (recomendado)
  locale: 'pt-BR',
  fallbackLocale: 'en-US',
  globalInjection: true, // Isso permite que o $t funcione no template como no Vue 2
  messages: {
    'pt-BR': ptBR,
    'en-US': enUS,
    'es-ES': esES
  }
})

export default i18n
