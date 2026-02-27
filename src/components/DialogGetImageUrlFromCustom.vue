<template>
  <v-dialog max-width="600" transition="dialog-top-transition">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="success"
        text="Carregar da pasta custom"
        variant="flat"
      ></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card
        title="Carregar imagem da pasta custom"
        subtitle="Selecione uma imagem da pasta custom para usar no painel."
      >
        <v-card-text>
          <v-alert density="compact" type="info" variant="tonal">
            Duplo-clique para pegar a URL da imagem. A pasta custom está localizada em:
            <code>public/images/custom</code>
          </v-alert>
        </v-card-text>

        <v-card-text>
          <v-row dense>
            <v-col v-for="(imagePath, index) in images" :key="index" cols="4">
              <div @dblclick="handleSelect(imagePath, isActive)" style="cursor: pointer">
                <v-card hover>
                  <v-card-text class="pa-2 bg-grey-lighten-2">
                    <v-img height="125" :src="imagePath"></v-img>
                  </v-card-text>
                  <v-card-title class="text-caption text-center px-1">
                    {{ imagePath.split('/').pop() }}
                  </v-card-title>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Fechar" @click="isActive.value = false"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const images = ref([])

const emit = defineEmits(['select'])

const handleSelect = (path, isActive) => {
  emit('select', path)
  isActive.value = false
}

onMounted(() => {
  const modulos = import.meta.glob('/public/images/custom/*.{png,jpg,jpeg,svg,webp}', {
    eager: true,
  })

  images.value = Object.keys(modulos).map((path) => {
    return path.replace('/public', '')
  })
})
</script>
