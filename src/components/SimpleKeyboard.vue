<template>
  <el-input
    :modelValue="modelValue"
    :placeholder="defaultValue"
    @update:modelValue="onChange"
  />
  <div :class="keyboardClass"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Keyboard from 'simple-keyboard';

export default defineComponent({
  name: 'SimpleKeyboard',
  emits: ['update:modelValue', 'keypress'],
  props: {
    layout: {
      default: () => [
        'Q W E R T Y U I O P {bksp}',
        'A S D F G H J K L {leeg}',
        'Z X C V B N M {space}',
      ],
      type: Array as PropType<string[]>,
    },
    display: {
      default: () => ({
        '{leeg}': 'Leeg',
        '{space}': 'Spatie',
        '{bksp}': 'Delete',
      }),
      type: Object as PropType<Record<string, string>>,
    },
    keyboardClass: {
      default: 'simple-keyboard',
      type: String,
    },
    modelValue: {
      type: String,
    },
    defaultValue: {
      default: '',
      type: String,
    },
  },
  data: () => ({
    keyboard: null as Keyboard | null,
  }),
  mounted() {
    this.keyboard = new Keyboard(this.keyboardClass, {
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      display: this.display,
      theme: '',
      layout: { default: this.layout },
    });
  },
  methods: {
    onChange(input: string) {
      this.$emit('update:modelValue', input);
    },
    onKeyPress(button: string) {
      this.$emit('keypress', button);
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === '{shift}' || button === '{lock}') this.handleShift();
      if (button === '{leeg}') this.handleLeeg();
      if (button === '{neg}') this.handleNeg();
    },
    handleNeg() {
      if (this.modelValue && this.modelValue.startsWith('-')) {
        this.onChange(this.modelValue.slice(1));
      } else if (this.modelValue === '') {
        this.onChange('-1');
      } else {
        this.onChange(`-${this.modelValue}`);
      }
    },
    handleLeeg() {
      if (this.keyboard) this.keyboard.setInput('');
    },
    handleShift() {
      const currentLayout = this.keyboard?.options.layoutName;
      const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';
      if (this.keyboard) {
        this.keyboard.setOptions({
          layoutName: shiftToggle,
        });
      }
    },
  },
  watch: {
    modelValue(input) {
      if (this.keyboard) {
        this.keyboard.setInput(input);
      }
    },
  },
});
</script>

<style>
.simple-keyboard {
  margin-bottom: 1em;
}

</style>
