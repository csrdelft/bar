<template>
  <v-snackbar
    :bottom="options.y === 'bottom'"
    :centered="options.x === 'centered'"
    :color="options.color"
    :left="options.x === 'left'"
    :right="options.x === 'right'"
    :timeout="options.timeout"
    :top="options.y === 'top'"
    v-model="model"
  >
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="close" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script lang="ts">
import Vue from "vue"
const defaultOptions: ToastOptions = {
  x: "left",
  y: "bottom",
  timeout: 3000,
  color: "default"
};

export interface ToastOptions {
  x?: "left" | "right" | "centered";
  y?: "bottom" | "top";
  timeout?: number;
  color?: string;
}

export default Vue.extend({
  data() {
    return {
      model: false,
      promise: null as {
        // eslint-disable-next-line no-unused-vars
        resolve: (value: unknown | PromiseLike<unknown>) => void;
        // eslint-disable-next-line no-unused-vars
        reject: (reason?: any) => void;
      } | null,
      text: {},
      options: {} as ToastOptions
    };
  },
  methods: {
    show(text: string, options: ToastOptions) {
      return new Promise((resolve, reject) => {
        if (this.model) this.model = false;
        this.$nextTick(() => {
          this.promise = { resolve, reject };
          this.text = text;
          this.options = { ...defaultOptions, ...options };
          this.model = true;
        });
      });
    },
    close() {
      this.promise?.resolve(true);
      this.model = false;
    }
  }
});
</script>