<template>

  <v-app id="inspire">

    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">

      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar v-if="rail" image="/favicon.ico"></v-avatar>
            <v-img v-else width="100" src="/images/logo.png" cover></v-img>
          </template>
          <template v-slot:append>
            <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
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

              <v-card-text class="flex items-center justify-center bg-grey-lighten-4 py-10">
                <v-sheet elevation="1" width="640px" height="360px" class="overflow-hidden relative flex flex-col"
                  rounded="lg">

                  <!-- HEADER -->
                  <v-sheet height="80px">
                    <div class="flex h-full px-5 items-center justify-between [&>*:only-child]:mx-auto"
                      :style="{ backgroundColor: header.bgColor, color: header.textColor }">

                      <img v-if="panelStore.headerLeftLogoUrlIsDefined" class="w-24" :src="header.leftLogoUrl" />

                      <span class="text-2xl font-bold uppercase">minha unidade</span>

                    </div>
                  </v-sheet>

                  <!-- MAIN -->
                  <v-sheet height="200px">
                    <div class="flex flex-1 h-full py-2 items-center justify-between bg-white"
                      :style="{ backgroundColor: main.bgColor }">

                      <!-- CURRENT TICKET -->
                      <div class="ml-3 flex w-3/4 h-full flex-col justify-between">

                        <span class="text-1xl font-bold uppercase" :style="{ color: main.ticketLabelColor }">
                          {{ ticketLabel }}
                        </span>

                        <div class="flex flex-col">

                          <span class="text-4xl font-bold uppercase" :style="{ color: main.ticketColor }">
                            A007
                          </span>

                          <span class="text-2xl font-bold uppercase" :style="{ color: main.ticketColor }">
                            james bond
                          </span>

                        </div>

                        <span class="text-2xl font-bold uppercase" :style="{ color: main.serviceColor }">
                          descição do serviço
                        </span>

                        <span class="text-4xl font-bold uppercase" :style="{ color: main.localColor }">
                          guichê 1
                        </span>

                      </div>

                      <!-- HISTORY -->
                      <v-sheet class="px-3 flex w-1/4 h-full flex-col items-center rounded-l-3xl"
                        :style="{ backgroundColor: main.historyBgColor }">

                        <span class="text-xs font-bold uppercase" :style="{ color: main.historyLabelColor }">
                          {{ $t('panel.history.title') }}
                        </span>

                        <span v-if="[].length === 0" class="text-1xl font-bold uppercase"
                          :style="{ color: main.historyEmptyColor }">
                          {{ $t('panel.empty') }}
                        </span>

                        <div class="w-full h-full flex flex-col items-center justify-around" v-else>

                          <div v-for="ticket in []" :key="ticket.id" class="flex flex-col text-center" :style="{
                            color: ticket.priority ? main.ticketPriorityColor : main.ticketColor
                          }">

                            <span class="text-7xl font-bold uppercase">
                              {{ ticket.ticket }}
                            </span>

                            <span v-if="main.historyShowLocal" class="text-3xl font-bold uppercase">
                              {{ ticket.local }}
                            </span>

                          </div>

                        </div>

                      </v-sheet>

                    </div>
                  </v-sheet>

                  <!-- FOOTER -->
                  <v-sheet height="80px">
                    <div class="flex h-full px-5 items-center justify-between [&>*:only-child]:mx-auto"
                      :style="{ backgroundColor: footer.bgColor, color: footer.textColor }">

                      <img v-if="panelStore.footerLeftLogoUrlIsDefined" class="w-24" :src="footer.leftLogoUrl" />

                      <div class="text-1xl text-white text-center font-medium">

                        <clock v-if="footer.showClock" :locale="mainStore.config.locale"
                          :dateFormat="$t('date_format')" />

                      </div>

                      <img v-if="panelStore.footerRightLogoUrlIsDefined" class="w-24" :src="footer.rightLogoUrl" />

                    </div>
                  </v-sheet>

                </v-sheet>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePanelStore } from '@/stores/panel'
import Clock from '@/components/Clock.vue'
import { useMainStore } from '@/stores/main'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const drawer = ref(true)
const rail = ref(false)

const panelStore = usePanelStore()
const { header, main, footer } = panelStore

const mainStore = useMainStore()

const ticketLabel = computed(() => {
  return mainStore.message.priority ? `${t('panel.ticket')} (${t('panel.priority')})` : t('panel.ticket')
})

</script>
