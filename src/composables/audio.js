import { ref } from 'vue'

const ALERT_PATH = 'sound'

export const alertsAvailable = {
  Default: 'ekiga-vm.wav',
  'Airport Bingbong': 'airport-bingbong.wav',
  'Ding dong': 'ding-dong.wav',
  'Doorbell Bingbong': 'doorbell-bingbong.wav',
  'Info bleep': 'infobleep.wav',
  'Quito Mariscal sucre': 'quito-mariscal-sucre.wav',
  'Toy doorbell': 'toydoorbell.wav',
}

export function useAlert() {
  const isPlaying = ref(false)
  let currentAudio = null

  /**
   * Reproduz um som de alerta
   * @param {string} filename Nome do arquivo (opcional)
   */
  const playAlert = (filename) => {
    return new Promise((resolve, reject) => {
      // Para o áudio atual se ainda estiver tocando
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }

      const file = filename || alertsAvailable.Default
      const audio = new Audio(`${ALERT_PATH}/${file}`)

      currentAudio = audio
      isPlaying.value = true

      audio.onended = () => {
        isPlaying.value = false
        currentAudio = null
        resolve()
      }

      audio.onerror = (e) => {
        isPlaying.value = false
        currentAudio = null
        reject(e)
      }

      audio.play().catch(reject)
    })
  }

  return {
    isPlaying,
    playAlert,
    alertsAvailable,
  }
}
