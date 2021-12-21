<template>
  <div class="d-flex flex-column align-center">
    <v-text-field
        ref="textField"
        :style="{ width: '100%' }"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onChange"
    />
    <div :class="{ 'd-none d-md-flex flex-column': true, [keyboardClass]: true }">
      <span
          v-for="(line, i) in layout"
          :key="i"
          class="keyboard d-inline-flex"
          :style="{ marginLeft: i * (staggered ? 32 : 0) + 'px' }"
      >
        <v-btn
            :class="{
            'ma-1 keyboard-button': true,
            special: key.startsWith('{'),
          }"
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
import Vue, {PropType} from "vue";

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
    placeholder: {
      default: "",
      type: String
    },
    grabFocus: {
      default: false,
      type: Boolean,
    }
  },
  mounted() {
    if (this.grabFocus) {
      (this.$refs.textField as HTMLElement).focus();
    }
  },
  methods: {
    onChange(input: string) {
      this.$emit("update:modelValue", input);
    },
    onKeyPress(button: string) {
      this.$emit("keypress", button);

      switch (button) {
        case "{leeg}":
          this.onChange("");
          break;
        case "{space}":
          this.onChange(this.modelValue + " ");
          break;
        case "{neg}":
          this.handleNeg();
          break;
        case "{bksp}":
          this.onChange(this.modelValue.slice(0, -1));
          break;
        default:
          this.onChange(this.modelValue + button);
          break;
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
