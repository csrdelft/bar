<template>
<div>
  <div class="simple-keyboard-input">
    <v-text-field
      :value="modelValue"
      :placeholder="defaultValue"
      @input="onChange"
    />
  </div>
  <div :class="keyboardClass + ' hg-theme-default'"></div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Keyboard from 'simple-keyboard';

export default Vue.extend({
  name: 'SimpleKeyboard',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
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
      // theme: '',
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
.hg-theme-default {
  margin-bottom: 1em;
}
.simple-keyboard-input {
  margin: 0.2em;
}

input {
  width: 100%;
  height: 100px;
  padding: 20px;
  font-size: 20px;
  border: none;
  box-sizing: border-box;
}

.hg-theme-default {
  /* max-width: 850px; */
}


/*
  Donker thema
*/
.theme--dark .hg-theme-default {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.theme--dark .hg-theme-default .hg-button {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}

.theme--dark .hg-theme-default .hg-button:active {
  /* background: #1c4995; */
  color: white;
}

</style>
