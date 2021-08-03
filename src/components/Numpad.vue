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
import Vue from 'vue';
import SimpleKeyboard from '@/components/SimpleKeyboard.vue';

export default Vue.extend({
  name: 'Numpad',
  components: { SimpleKeyboard },
  model: {
     prop: 'modelValue',
     event: 'update:modelValue',
  },
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
