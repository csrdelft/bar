<template>
  <SimpleKeyboard
    :layout="['7 8 9', '4 5 6', '1 2 3', '{bksp} 0 {neg}']"
    :display="{'{bksp}': '<', '{neg}': '-'}"
    @update:modelValue="$emit('update:modelValue', $event)"
    :modelValue="modelValue"
    :defaultValue="defaultValue"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SimpleKeyboard from '@/components/SimpleKeyboard.vue';

export default defineComponent({
  name: 'Numpad',
  components: { SimpleKeyboard },
  emits: ['update:modelValue'],
  props: {
    modelValue: String,
    defaultValue: {
      default: '',
      type: String,
    },
  },
});
</script>

<style scoped>

</style>
