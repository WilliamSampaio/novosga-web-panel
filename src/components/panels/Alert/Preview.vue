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

              <span class="text-2xl font-bold uppercase">
                {{ panelDataPreview.unityDescription }}
              </span>
            </div>
          </v-sheet>

          <v-sheet height="240px">
            <div class="flex h-full flex-col p-3" :style="{ backgroundColor: main.bgColor }">
              <div class="flex items-start justify-between gap-4">
                <div class="flex min-w-0 flex-1 flex-col">
                  <span
                    class="text-[11pt] font-bold uppercase"
                    :style="{ color: main.ticketLabelColor }"
                  >
                    {{ ticketLabel }}
                  </span>

                  <span
                    class="max-w-full break-words text-[30pt] leading-none font-black uppercase"
                    :style="{ color: ticketColor }"
                  >
                    {{ featuredText }}
                  </span>
                </div>

                <div
                  class="flex min-w-28 flex-col items-center justify-center rounded border-4 px-2 py-1"
                  :style="{ borderColor: ticketColor, color: ticketColor }"
                >
                  <span class="text-[8pt] font-bold uppercase">
                    {{ $t('panel.alert.attendance') }}
                  </span>
                  <span class="text-[17pt] leading-none font-black uppercase">
                    {{ panelDataPreview.message.ticket }}
                  </span>
                  <span class="mt-1 text-[24pt] leading-none font-black tabular-nums">00:00</span>
                </div>
              </div>

              <div class="mt-auto grid grid-cols-2 items-end gap-3">
                <div class="flex min-w-0 flex-col">
                  <span
                    class="max-w-full break-words text-[13pt] leading-tight font-bold uppercase"
                    :style="{ color: main.serviceColor }"
                  >
                    {{ panelDataPreview.message.service }}
                  </span>

                  <span
                    class="max-w-full break-words text-[21pt] leading-none font-black uppercase"
                    :style="{ color: main.localColor }"
                  >
                    {{ panelDataPreview.message.local }}
                  </span>
                </div>

                <div class="flex min-w-0 flex-col text-right">
                  <span
                    class="text-[11pt] font-bold uppercase"
                    :style="{ color: main.ticketLabelColor }"
                  >
                    {{ $t('panel.priority') }}
                  </span>

                  <span
                    class="max-w-full break-words text-[17pt] leading-tight font-black uppercase"
                    :style="{ color: ticketColor }"
                  >
                    {{ priorityText }}
                  </span>
                </div>
              </div>
            </div>
          </v-sheet>

          <v-sheet height="60px">
            <div
              class="flex h-full px-5 items-center justify-between [&>*:only-child]:mx-auto"
              :style="{ backgroundColor: footer.bgColor }"
            >
              <img
                v-if="panelStore.footerLeftLogoUrlIsDefined"
                class="max-w-24 max-h-12 py-1 object-contain"
                :src="footer.leftLogoUrl"
              />

              <div class="text-1xl text-white text-center font-medium">
                <Clock v-if="footer.showClock" :locale="locale" :fontColor="footer.textColor" />
              </div>

              <img
                v-if="panelStore.footerRightLogoUrlIsDefined"
                class="max-w-24 max-h-12 py-1 object-contain"
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
        :label="$t('panel.preview.empty_panel')"
        hide-details
        color="primary"
        :disabled="panelState.hideClientName === true || panelState.priority === true"
      ></v-switch>

      <v-switch
        v-model="panelState.hideClientName"
        :label="$t('panel.preview.client_name_missing')"
        hide-details
        color="primary"
        :disabled="panelState.empty === true"
      ></v-switch>

      <v-switch
        v-model="panelState.priority"
        :label="$t('panel.preview.current_ticket_priority')"
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
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const panelState = reactive({
  empty: false,
  hideClientName: false,
  priority: false,
})

const panelStore = usePanelStore()
const { header, main, footer } = panelStore

const panelDataPreview = computed(() => {
  return {
    unityDescription: panelState.empty ? '---' : t('panel.preview.sample_unit'),
    message: {
      ticket: panelState.empty ? '---' : 'A007',
      clientName:
        panelState.empty || panelState.hideClientName ? '' : t('panel.preview.sample_client_1'),
      service: panelState.empty ? '---' : t('panel.preview.sample_service'),
      local: panelState.empty ? '---' : t('panel.preview.sample_counter_1'),
      priority: panelState.priority,
    },
  }
})

const featuredText = computed(() => {
  const { message } = panelDataPreview.value

  if (message.clientName) return message.clientName

  return message.ticket
})

const priorityText = computed(() => {
  return panelState.priority ? t('panel.priority') : t('panel.empty')
})

const ticketLabel = computed(() => {
  return panelState.priority
    ? `${t('panel.alert.attendance')}`
    : t('panel.alert.attendance')
})

const ticketColor = computed(() => {
  return panelState.priority ? main.ticketPriorityColor : main.ticketColor
})
</script>
