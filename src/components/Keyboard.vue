<template>
  <div :class="keyboardClass"></div>
</template>

<script lang="ts">
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Keyboard',
  props: {
    keyboardClass: {
      default: 'simple-keyboard',
      type: String,
    },
    input: {
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
      layout: {
        default: [
          'Q W E R T Y U I O P {bksp}',
          'A S D F G H J K L {leeg}',
          'Z X C V B N M {space}',
        ],
      },
      display: {
        '{leeg}': 'Leeg',
        '{space}': 'Spatie',
        '{bksp}': 'Delete',
      },
    });
  },
  methods: {
    onChange(input: string) {
      this.$emit('onChange', input);
    },
    onKeyPress(button: string) {
      this.$emit('onKeyPress', button);
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === '{shift}' || button === '{lock}') this.handleShift();
      if (button === '{leeg}') this.handleLeeg();
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
    input(input) {
      if (this.keyboard) this.keyboard.setInput(input);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hg-row {
  justify-content: center;
}

.hg-theme-default .hg-button{
  font-size: 2em;
  flex-grow: 0;
  padding: 1em;
}

.hg-theme-default .hg-button.hg-standardBtn {
  width: 80px;
  height: 80px;
}

.hg-theme-default .hg-button.hg-functionBtn {
  height: 80px;
}
</style>
