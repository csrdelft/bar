<template>
  <SimpleKeyboard
    @update:modelValue="emitValue"
    :modelValue="modelValue"
    keyboard-class="full-keyboard"
  />
</template>

<script lang="ts">
import 'simple-keyboard/build/css/index.css';
import { defineComponent } from 'vue';
import SimpleKeyboard from '@/components/SimpleKeyboard.vue';

export default defineComponent({
  name: 'Keyboard',
  model: {
    prop: 'input',
    event: 'change',
  },
  components: { SimpleKeyboard },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
    },
    modelModifiers: {
      default: () => ({}),
    },
  },
  methods: {
    emitValue(value: string) {
      let val = value;
      if ('uppercase' in this.modelModifiers) {
        val = val.toUpperCase();
      }
      this.$emit('update:modelValue', val);
    },
  },
});
</script>

<style>
.full-keyboard .hg-row {
  justify-content: center;
}

.full-keyboard.hg-theme-default .hg-button {
  font-size: 2em;
  flex-grow: 0;
  padding: 1em;
}

.full-keyboard.hg-theme-default .hg-button.hg-standardBtn {
  width: 80px;
  height: 80px;
}

.full-keyboard.hg-theme-default .hg-button.hg-functionBtn {
  height: 80px;
}
</style>
