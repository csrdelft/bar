<template>
  <div class="d-flex flex-column align-center">
    <v-text-field
      :style="{ width: '100%' }"
      :autofocus="true"
      :value="modelValue"
      :placeholder="defaultValue"
      @input="onChange"
    />
    <div :class="{'d-flex flex-column': true, [keyboardClass]: true}">
      <span
        v-for="(line, i) in layout"
        :key="i"
        class="keyboard d-inline-flex"
        :style="{ marginLeft: i * (staggered ? 32 : 0) + 'px' }"
      >
        <v-btn
          :class="
            'ma-1 keyboard-button ' + (key.startsWith('{') ? 'special' : '')
          "
          v-for="key in line.split(' ')"
          :key="key"
          @click="(e) => onKeyPress(key)"
        >
          {{ key in display ? display[key] : key }}
        </v-btn>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "SimpleKeyboard",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  props: {
    layout: {
      default: () => [
        "Q W E R T Y U I O P {bksp}",
        "A S D F G H J K L {leeg}",
        "Z X C V B N M {space}"
      ],
      type: Array as PropType<string[]>
    },
    display: {
      default: () => ({
        "{leeg}": "Leeg",
        "{space}": "Spatie",
        "{bksp}": "Delete"
      }),
      type: Object as PropType<Record<string, string>>
    },
    staggered: {
      default: false,
      type: Boolean
    },
    keyboardClass: {
      default: "simple-keyboard",
      type: String
    },
    modelValue: {
      type: String
    },
    defaultValue: {
      default: "",
      type: String
    }
  },
  methods: {
    onChange(input: string) {
      this.$emit("update:modelValue", input);
    },
    onKeyPress(button: string) {
      this.$emit("keypress", button);
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{leeg}") this.handleLeeg();
      if (button === "{space}") this.onChange(this.modelValue + " ");
      if (button === "{neg}") this.handleNeg();
      if (button === "{bksp}") this.onChange(this.modelValue.slice(0, -1));

      if (!button.startsWith("{")) {
        this.onChange(this.modelValue + button);
      }
    },
    handleNeg() {
      if (this.modelValue && this.modelValue.startsWith("-")) {
        this.onChange(this.modelValue.slice(1));
      } else if (this.modelValue === "") {
        this.onChange("-1");
      } else {
        this.onChange(`-${this.modelValue}`);
      }
    },
    handleLeeg() {
      this.onChange("");
    }
  }
});
</script>

<style>
.keyboard .keyboard-button.v-size--default {
  height: 60px;
  min-width: 60px;
  padding: 0;
  font-size: 1rem;
}

.keyboard .keyboard-button.v-size--default.special {
  width: 120px;
}
</style>
