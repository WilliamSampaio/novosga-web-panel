<script setup>
import { computed } from 'vue'

const props = defineProps({
  videoId: { type: String, required: true },
  isPlaylist: { type: Boolean, default: false, required: false }
})

const videoUrl = computed(() => {
  const baseUrl = `https://www.youtube.com/embed/${props.videoId}?`
  const params = new URLSearchParams({
    autoplay: 1,
    mute: 1, // Geralmente obrigatório para autoplay funcionar
    controls: 0,
    loop: 1,
    rel: 0,
    // Para loop de vídeo único, o YouTube exige o parâmetro playlist com o mesmo ID
    playlist: props.videoId
  })

  if (props.isPlaylist) {
    params.delete('playlist')
    params.set('listType', 'playlist')
    params.set('list', props.videoId)
  }

  return baseUrl + params.toString()
})
</script>

<template>
  <div class="fixed inset-0 z-0 w-full h-full bg-black">
    <iframe class="w-full h-full pointer-events-none" :src="videoUrl" frameborder="0" allow="autoplay; encrypted-media"
      allowfullscreen></iframe>
  </div>
</template>
