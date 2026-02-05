import { ref } from 'vue'

export function useSpeech() {
  const isSpeaking = ref(false)

  /**
   * Fala um único texto
   */
  const speak = (text, lang) => {
    return new Promise((resolve, reject) => {
      // Cancela falas anteriores para evitar sobreposição no painel
      window.speechSynthesis.cancel()

      const msg = new SpeechSynthesisUtterance()
      msg.text = text
      msg.lang = (lang || 'pt-BR').replace('_', '-').toLowerCase()

      msg.onstart = () => { isSpeaking.value = true }
      msg.onerror = (e) => {
        isSpeaking.value = false
        reject(e)
      }
      msg.onend = () => {
        isSpeaking.value = false
        resolve()
      }

      window.speechSynthesis.speak(msg)
    })
  }

  /**
   * Fala uma lista de textos em sequência (Recursivo Moderno)
   */
  const speakAll = async (texts, lang) => {
    for (const text of texts) {
      try {
        await speak(text, lang)
      } catch (error) {
        console.error('Erro na síntese de voz:', error)
        break // Interrompe a fila se houver erro
      }
    }
  }

  /**
   * Interrompe qualquer fala imediatamente
   */
  const stop = () => {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  return {
    isSpeaking,
    speak,
    speakAll,
    stop
  }
}
