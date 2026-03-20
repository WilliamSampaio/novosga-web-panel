<template>
  <v-row>
    <v-col cols="9">
      <v-sheet class="flex items-center justify-center py-10">
        <v-sheet
          elevation="1"
          width="640px"
          height="360px"
          class="overflow-hidden relative flex flex-col"
          rounded="lg"
        >
          <!-- HEADER -->
          <v-sheet height="60px">
            <div
              class="flex h-full px-5 items-center justify-between [&>*:only-child]:mx-auto"
              :style="{ backgroundColor: header.bgColor, color: header.textColor }"
            >
              <img
                v-if="panelStore.headerLeftLogoUrlIsDefined"
                class="w-24"
                :src="header.leftLogoUrl"
              />

              <span class="text-2xl font-bold uppercase">{{
                panelDataPreview.unityDescription
              }}</span>
            </div>
          </v-sheet>

          <!-- MAIN -->
          <v-sheet height="240px">
            <div
              class="h-full flex flex-col justify-between"
              :style="{ backgroundColor: main.bgColor }"
            >
              <!-- CURRENT TICKET -->
              <div class="ma-1 h-1/2 flex flex-col justify-between">
                <div class="flex flex-col">
                  <span
                    v-if="!panelState.hideClientName"
                    class="text-1xl font-bold uppercase"
                    :style="{ color: main.ticketLabelColor }"
                  >
                    {{ ticketLabel }} {{ panelDataPreview.message.ticket }}
                  </span>
                  <span
                    v-else
                    class="text-1xl font-bold uppercase"
                    :style="{ color: main.ticketLabelColor }"
                  >
                    {{ ticketLabel }}
                  </span>

                  <span
                    v-if="!panelState.hideClientName"
                    class="text-3xl font-bold uppercase"
                    :style="{ color: ticketColor }"
                  >
                    {{
                      panelDataPreview.message.clientName
                        ? formatarNome(panelDataPreview.message.clientName)
                        : ticketLabel
                    }}
                  </span>
                  <span v-else class="text-3xl font-bold uppercase" :style="{ color: ticketColor }">
                    {{ panelDataPreview.message.ticket }}
                  </span>
                </div>

                <div class="flex flex-col">
                  <span class="text-1xl font-bold uppercase" :style="{ color: main.serviceColor }">
                    {{ panelDataPreview.message.service }}
                  </span>

                  <span class="text-3xl font-bold uppercase" :style="{ color: main.localColor }">
                    {{ panelDataPreview.message.local }}
                  </span>
                </div>
              </div>

              <!-- HISTORY -->
              <v-sheet
                class="pa-1 h-1/2 flex flex-col items-center rounded-t-2xl"
                :style="{ backgroundColor: main.historyBgColor }"
              >
                <span
                  class="text-[8pt] font-bold uppercase"
                  :style="{ color: main.historyLabelColor }"
                >
                  {{ $t('panel.history.title') }}
                </span>

                <span
                  v-if="panelDataPreview.history.length === 0"
                  class="text-1xl font-bold uppercase"
                  :style="{ color: main.historyEmptyColor }"
                >
                  {{ $t('panel.empty') }}
                </span>

                <div class="w-full h-full" v-else>
                  <div
                    class="flex justify-between"
                    v-for="ticket in panelDataPreview.history.slice(0, 6)"
                    :key="ticket.id"
                    :style="{
                      color: ticket.priority ? main.ticketPriorityColor : main.ticketColor,
                    }"
                  >
                    <span class="w-[50%] text-[8pt] font-bold uppercase">
                      {{ ticket.ticket }} -
                      {{
                        ticket.clientName
                          ? formatarNome(ticket.clientName, true)
                          : $t('panel.empty')
                      }}
                    </span>
                    <span class="w-[50%] text-[8pt] font-bold uppercase">
                      {{ formatarNome(ticket.service) }}
                    </span>
                  </div>
                </div>
              </v-sheet>
            </div>
          </v-sheet>

          <!-- FOOTER -->
          <v-sheet height="60px">
            <div
              class="flex h-full px-5 items-center justify-between [&>*:only-child]:mx-auto"
              :style="{ backgroundColor: footer.bgColor }"
            >
              <img
                v-if="panelStore.footerLeftLogoUrlIsDefined"
                class="w-24"
                :src="footer.leftLogoUrl"
              />

              <div class="text-1xl text-white text-center font-medium">
                <Clock v-if="footer.showClock" :locale="locale" :fontColor="footer.textColor" />
              </div>

              <img
                v-if="panelStore.footerRightLogoUrlIsDefined"
                class="w-24"
                :src="footer.rightLogoUrl"
              />
            </div>
          </v-sheet>
        </v-sheet>
      </v-sheet>
    </v-col>

    <v-col cols="3">
      <v-switch
        v-model="panelState.empty"
        label="Painel vazio"
        hide-details
        color="primary"
        :disabled="
          panelState.hideClientName === true ||
          panelState.priority === true ||
          panelState.historyEmpty === true
        "
      ></v-switch>

      <v-switch
        v-model="panelState.hideClientName"
        label="Nome do cliente não informado"
        hide-details
        color="primary"
        :disabled="panelState.empty === true"
      ></v-switch>

      <v-switch
        v-model="panelState.priority"
        label="Senha atual prioridade"
        hide-details
        color="primary"
        :disabled="panelState.empty === true"
      ></v-switch>

      <v-switch
        v-model="panelState.historyEmpty"
        label="Histórico vazio"
        hide-details
        color="primary"
        :disabled="panelState.empty === true"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script setup>
import Clock from '@/components/Clock.vue'
import { usePanelStore } from '@/stores/panel'
import { formatarNome } from '@/util/functions'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const panelState = reactive({
  empty: false,
  hideClientName: false,
  priority: false,
  historyEmpty: false,
})

const panelStore = usePanelStore()
const { header, main, footer } = panelStore

const { locale } = useI18n()

const panelDataPreview = computed(() => {
  const data = {
    unityDescription: panelState.empty ? '---' : 'minha unidade',
    message: {
      ticket: panelState.empty ? '---' : 'A007',
      clientName: panelState.empty ? '---' : 'james bond',
      service: panelState.empty ? '---' : 'descrição do serviço',
      local: panelState.empty ? '---' : 'guichê 1',
      priority: panelState.priority,
    },
    history: [
      {
        id: 1,
        ticket: 'A006',
        clientName: panelState.empty ? '---' : 'maria bonita',
        service: panelState.empty ? '---' : 'descrição do serviço',
        priority: false,
      },
      {
        id: 2,
        ticket: 'P007',
        clientName: panelState.empty ? '---' : 'virgulino',
        service: panelState.empty ? '---' : 'descrição do serviço',
        priority: true,
      },
      {
        id: 3,
        ticket: 'A005',
        clientName: panelState.empty ? '---' : 'fulano de tal',
        service: panelState.empty ? '---' : 'descrição do serviço',
        priority: false,
      },
      {
        id: 4,
        ticket: 'A004',
        clientName: panelState.empty ? '---' : 'ana bolinha',
        service: panelState.empty ? '---' : 'descrição do serviço',
        priority: false,
      },
      {
        id: 5,
        ticket: 'A003',
        clientName: panelState.empty ? '---' : 'severino',
        service: panelState.empty ? '---' : 'descrição do serviço',
        priority: false,
      },
      {
        id: 6,
        ticket: 'A002',
        clientName: panelState.empty ? '---' : 'luva de pedreiro',
        service: panelState.empty ? '---' : 'descrição do serviço',
        priority: false,
      },
      {
        id: 7,
        ticket: 'A001',
        clientName: panelState.empty ? '---' : 'james bond',
        service: panelState.empty ? '---' : 'descrição do serviço',
        priority: false,
      },
    ],
  }

  if (panelState.empty || panelState.historyEmpty) {
    data.history = []
  }

  return data
})

const ticketLabel = computed(() => {
  return panelState.priority ? `(${t('panel.priority')}) ${t('panel.ticket')}` : t('panel.ticket')
})

const ticketColor = computed(() => {
  return panelState.priority ? main.ticketPriorityColor : main.ticketColor
})
</script>
