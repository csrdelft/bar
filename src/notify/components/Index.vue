<template>
  <div>
    <toast-component ref="toast" />
    <dialog-component ref="dialog" />
  </div>
</template>

<script lang="ts">
import ToastComponent, { ToastOptions } from "./Toast.vue";
import DialogComponent, { DialogOptions } from "./Dialog.vue";
import Vue, { VueConstructor } from "vue";
export default (Vue as VueConstructor<
  Vue & {
    $refs: {
      toast: InstanceType<typeof ToastComponent>;
      dialog: InstanceType<typeof DialogComponent>;
    };
  }
>).extend({
  components: { ToastComponent, DialogComponent },
  data() {
    return {
      options: {
        dialog: {} as DialogOptions,
        toast: {} as ToastOptions
      }
    };
  },
  computed: {},
  methods: {
    toast(text: string, opts: ToastOptions = {}) {
      return this.$refs.toast.show(text, {
        ...(this.options?.toast ?? {}),
        ...opts
      });
    },
    show(data: Record<string, any>, opts: DialogOptions = {}) {
      return this.$refs.dialog.show(data, {
        ...(this.options?.dialog ?? {}),
        ...opts
      });
    },
    confirm(data: Record<string, any>, opts: DialogOptions = {}) {
      return this.show(data, { ...opts, type: "confirm" });
    },
    prompt(data: Record<string, any>, opts: DialogOptions = {}) {
      return this.show(data, { ...opts, type: "prompt" });
    }
  }
});
</script>