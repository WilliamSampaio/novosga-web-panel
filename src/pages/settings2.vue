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

                <v-row>

                  <v-col cols="9">

                    <v-sheet class="flex items-center justify-center bg-grey-lighten-4 py-10">

                      <v-sheet elevation="1" width="640px" height="360px" class="overflow-hidden relative flex flex-col"
                        rounded="lg">

                        <!-- HEADER -->
                        <v-sheet height="80px">
                          <div class="flex h-full px-5 items-center justify-between [&>*:only-child]:mx-auto"
                            :style="{ backgroundColor: header.bgColor, color: header.textColor }">

                            <img v-if="panelStore.headerLeftLogoUrlIsDefined" class="w-24" :src="header.leftLogoUrl" />

                            <span class="text-2xl font-bold uppercase">{{ panelDataPreview.unityDescription }}</span>

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

                                <span class="text-4xl font-bold uppercase" :style="{ color: ticketColor }">
                                  {{ panelDataPreview.message.ticket }}
                                </span>

                                <span v-if="!panelState.hideClientName" class="text-2xl font-bold uppercase"
                                  :style="{ color: ticketColor }">
                                  {{ panelDataPreview.message.clientName }}
                                </span>

                              </div>

                              <span class="text-2xl font-bold uppercase" :style="{ color: main.serviceColor }">
                                {{ panelDataPreview.message.service }}
                              </span>

                              <span class="text-4xl font-bold uppercase" :style="{ color: main.localColor }">
                                {{ panelDataPreview.message.local }}
                              </span>

                            </div>

                            <!-- HISTORY -->
                            <v-sheet class="px-3 flex w-1/4 h-full flex-col items-center rounded-l-3xl"
                              :style="{ backgroundColor: main.historyBgColor }">

                              <span class="text-xs font-bold uppercase" :style="{ color: main.historyLabelColor }">
                                {{ $t('panel.history.title') }}
                              </span>

                              <span v-if="panelDataPreview.history.length === 0" class="text-2xl font-bold uppercase"
                                :style="{ color: main.historyEmptyColor }">
                                {{ $t('panel.empty') }}
                              </span>

                              <div class="w-full h-full flex flex-col items-center justify-around" v-else>

                                <div v-for="ticket in panelDataPreview.history" :key="ticket.id"
                                  class="flex flex-col text-center" :style="{
                                    color: ticket.priority ? main.ticketPriorityColor : main.ticketColor
                                  }">

                                  <span class="text-2xl font-bold uppercase">
                                    {{ ticket.ticket }}
                                  </span>

                                  <span v-if="main.historyShowLocal" class="font-bold uppercase">
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

                            <img v-if="panelStore.footerRightLogoUrlIsDefined" class="w-24"
                              :src="footer.rightLogoUrl" />

                          </div>
                        </v-sheet>

                      </v-sheet>

                    </v-sheet>

                  </v-col>

                  <v-col cols="3">

                    <v-switch v-model="panelState.empty" label="Painel vazio" hide-details color="primary"
                      :disabled="panelState.hideClientName === true || panelState.priority === true || panelState.historyEmpty === true"></v-switch>

                    <v-switch v-model="panelState.hideClientName" label="Ocultar nome do cliente" hide-details
                      color="primary" :disabled="panelState.empty === true"></v-switch>

                    <v-switch v-model="panelState.priority" label="Senha atual prioridade" hide-details color="primary"
                      :disabled="panelState.empty === true"></v-switch>

                    <v-switch v-model="panelState.historyEmpty" label="Histórico vazio" hide-details color="primary"
                      :disabled="panelState.empty === true"></v-switch>

                  </v-col>

                </v-row>

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { usePanelStore } from '@/stores/panel'
import Clock from '@/components/Clock.vue'
import { useMainStore } from '@/stores/main'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const drawer = ref(true)
const rail = ref(false)

const panelState = reactive({
  empty: false,
  hideClientName: false,
  priority: false,
  historyEmpty: false,
})

const panelStore = usePanelStore()
const { header, main, footer } = panelStore

const mainStore = useMainStore()

const panelDataPreview = computed(() => {

  const data = {
    unityDescription: panelState.empty ? '---' : 'minha unidade',
    message: {
      ticket: panelState.empty ? '---' : 'A007',
      clientName: panelState.empty ? '---' : 'james bond',
      service: panelState.empty ? '---' : 'descrição do serviço',
      local: panelState.empty ? '---' : 'guichê 1',
      priority: panelState.priority
    },
    history: [
      {
        id: 1,
        ticket: 'A001',
        local: 'guichê 1',
        priority: false
      },
      {
        id: 2,
        ticket: 'A002',
        local: 'guichê 2',
        priority: true
      },
      {
        id: 3,
        ticket: 'A003',
        local: 'guichê 3',
        priority: false
      }
    ]
  }

  if (panelState.empty || panelState.historyEmpty) {
    data.history = []
  }

  return data
})

const ticketLabel = computed(() => {
  return panelState.priority ? `${t('panel.ticket')} (${t('panel.priority')})` : t('panel.ticket')
})

const ticketColor = computed(() => {
  return panelState.priority ? main.ticketPriorityColor : main.ticketColor
})

// watch(panelState, () => {
//   panelStore.setHeader(panelDataPreview.value.header)
//   panelStore.setMain(panelDataPreview.value.main)
//   panelStore.setFooter(panelDataPreview.value.footer)
// }, { deep: true, immediate: true })

</script>
