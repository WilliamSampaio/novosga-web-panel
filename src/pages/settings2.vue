<template>

  <v-app id="inspire">

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
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import PanelPreview from '@/components/PanelPreview.vue'

const drawer = ref(true)
const rail = ref(false)

// watch(panelState, () => {
//   panelStore.setHeader(panelDataPreview.value.header)
//   panelStore.setMain(panelDataPreview.value.main)
//   panelStore.setFooter(panelDataPreview.value.footer)
// }, { deep: true, immediate: true })

</script>
