<template>

  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">

    <v-list>
      <v-list-item>
        <template v-slot:prepend>
          <v-avatar v-if="rail" image="/favicon.ico"></v-avatar>
        </template>

        <v-img v-if="!rail" width="100" src="/images/logo.png" cover></v-img>

        <template v-slot:append>
          <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>

      <v-btn v-if="rail" :to="{ name: 'home' }" icon="mdi-chevron-left" size="small" variant="tonal"
        color="primary"></v-btn>

      <v-btn v-else :to="{ name: 'home' }" prepend-icon="mdi-chevron-left" variant="tonal" color="primary" block>
        {{ $t('menu.go_back') }}
      </v-btn>

    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>


      <v-list-item prepend-icon="mdi-cog" title="Configurações" value="myfiles"></v-list-item>
    </v-list>

    <template #append>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-github" title="NovoSGA Web Panel"
          href="https://github.com/WilliamSampaio/novosga-web-panel" target="_blank"></v-list-item>
      </v-list>
    </template>

  </v-navigation-drawer>

  <v-main>
    <v-container class="py-8 px-6" fluid>
      <v-row>
        <v-col cols="12">
          <v-card prepend-icon="mdi-panorama-outline" title="Painel" subtitle="Configurações do Painel.">
            <v-divider></v-divider>

            <v-card-text class="pa-0">

              <PanelPreview />

            </v-card-text>

            <v-divider></v-divider>

            <v-card-text>

              <v-text-field v-model="panelStore.header.leftLogoUrl" label="Logo URL do cabeçalho"
                prepend-icon="mdi-image" density="compact" clearable>

                <template v-slot:append>
                  <DialogGetImageUrlFromCustom @select="(imagePath) => panelStore.header.leftLogoUrl = imagePath" />
                </template>

              </v-text-field>

              <v-text-field v-model="panelStore.footer.leftLogoUrl" label="Logo URL do rodapé (esquerda)"
                prepend-icon="mdi-image" density="compact" clearable>

                <template v-slot:append>
                  <DialogGetImageUrlFromCustom @select="(imagePath) => panelStore.footer.leftLogoUrl = imagePath" />
                </template>

              </v-text-field>

              <v-text-field v-model="panelStore.footer.rightLogoUrl" label="Logo URL do rodapé (direita)"
                prepend-icon="mdi-image" density="compact" clearable>

                <template v-slot:append>
                  <DialogGetImageUrlFromCustom @select="(imagePath) => panelStore.footer.rightLogoUrl = imagePath" />
                </template>

              </v-text-field>

            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { usePanelStore } from '@/stores/panel'
import PanelPreview from '@/components/PanelPreview.vue'
import DialogGetImageUrlFromCustom from '@/components/DialogGetImageUrlFromCustom.vue'

const drawer = ref(true)
const rail = ref(false)

const panelStore = usePanelStore()

// watch(panelState, () => {
//   panelStore.setHeader(panelDataPreview.value.header)
//   panelStore.setMain(panelDataPreview.value.main)
//   panelStore.setFooter(panelDataPreview.value.footer)
// }, { deep: true, immediate: true })

</script>
