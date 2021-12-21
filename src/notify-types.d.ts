import {ToastOptions} from '@/notify/components/Toast.vue'
import {DialogOptions} from '@/notify/components/Dialog.vue'

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
