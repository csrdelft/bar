<template>
  <v-dialog max-width="500" persistent v-model="model">
    <v-card class="text-center py-5">
      <v-icon
        :color="color"
        class="py-5"
        size="128"
        v-if="data.type"
        >{{ icon }}</v-icon
      >
      <v-card-title class="justify-center headline" v-if="data.title">{{
        data.title
      }}</v-card-title>
      <v-card-text>
        {{ data.text }}
        <v-text-field
          class="mt-5"
          clearable
          outlined
          v-if="options.type === 'prompt'"
          v-model="dataInput"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="justify-center">
        <template v-if="options.type === 'confirm'">
          <v-btn @click.stop="no" large width="120">{{ options.noText }}</v-btn>
          <v-btn @click.stop="yes" class="primary" dark large width="120">{{
            options.yesText
          }}</v-btn>
        </template>
        <template v-else-if="options.type === 'prompt'">
          <v-btn @click.stop="close" large width="120">{{
            options.noText
          }}</v-btn>
          <v-btn
            @click.stop="yesPrompt"
            class="primary"
            dark
            large
            width="120"
            >{{ options.yesText }}</v-btn
          >
        </template>
        <template v-else>
          <v-btn @click.stop="yes" large width="120">{{
            options.yesText
          }}</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"

const defaultOptions: DialogOptions = {
  x: "left",
  y: "bottom",
  timeout: 3000,
  color: "default",
  noText: "Annuleren",
  yesText: "OK"
};

export interface DialogOptions {
  x?: "left" | "right";
  y?: "bottom" | "top";
  timeout?: number;
  color?: string;
  type?: "prompt" | "confirm";
  noText?: string;
  yesText?: string;
}

export default Vue.extend({
  data() {
    return {
      model: false,
      promise: null as {
        // eslint-disable-next-line no-unused-vars
        resolve: (val: unknown) => void;
        // eslint-disable-next-line no-unused-vars
        reject: (val: unknown) => void;
      } | null,
      data: {
        type: null as null | "success" | "info" | "warning" | "error"
      },
      dataInput: "",
      options: {} as DialogOptions
    };
  },
  computed: {
    icon() {
      switch (this.data.type) {
        case "success":
          return "mdi-check-circle-outline";
        case "info":
          return "mdi-information-outline";
        case "warning":
          return "mdi-alert-decagram";
        case "error":
          return "mdi-alert";
        default:
          return "";
      }
    },
    color() {
      switch (this.data.type) {
        case "success":
          return "success";
        case "info":
          return "info";
        case "warning":
          return "warning";
        case "error":
          return "error";
        default:
          return "";
      }
    }
  },
  methods: {
    show(data: Record<string, any>, options: DialogOptions) {
      return new Promise((resolve, reject) => {
        if (this.model) this.model = false;
        this.$nextTick(() => {
          this.promise = Object.assign({}, { resolve, reject });
          this.data = { ...this.data, ...data };
          this.options = { ...defaultOptions, ...options };
          this.model = true;
        });
      });
    },
    yesPrompt() {
      if (!this.dataInput) return;
      this.promise?.resolve(this.dataInput);
      this.close();
    },
    yes() {
      this.promise?.resolve(true);
      this.close();
    },
    no() {
      this.promise?.reject(false);
      this.close();
    },
    close() {
      this.dataInput = "";
      this.data = { type: null };
      this.options = {};
      this.model = false;
    }
  }
});
</script>
