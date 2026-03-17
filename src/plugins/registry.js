import { defineAsyncComponent } from 'vue'

export const LIST_PANEL_MODELS = {
  default: {
    name: 'Default',
    component: defineAsyncComponent(() => import('@/components/panels/Default/Panel.vue')),
    previewComponent: defineAsyncComponent(() => import('@/components/panels/Default/Preview.vue')),
    text: '$TICKET$ $CLIENT$ $LOCAL$',
  },
  model001: {
    name: 'Model001',
    component: defineAsyncComponent(() => import('@/components/panels/Model001/Panel.vue')),
    previewComponent: defineAsyncComponent(
      () => import('@/components/panels/Model001/Preview.vue'),
    ),
    text: '$CLIENT_OR_TICKET$ $LOCAL$ $SERVICE$',
  },
}
