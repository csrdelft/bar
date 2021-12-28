import Vue from 'vue'
import {Store} from 'vuex'
import {State} from './store'
import {ToastOptions} from '@/notify/components/Toast.vue'
import {DialogOptions} from '@/notify/components/Dialog.vue'

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    store?: Store<State>;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $store: Store<State>;
  }
}

export declare global {
  interface Window {
    oauth2Callback: (uri: string) => void
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $notify: {
      toast: (text: string, options?: ToastOptions) => Promise<void>
      show: (data: Record<string, any>, options?: DialogOptions) => Promise<void>
      confirm: (data: Record<string, any>, options?: DialogOptions) => Promise<void>
      prompt: (data: Record<string, any>, options?: DialogOptions) => Promise<void>
    }
  }
}
