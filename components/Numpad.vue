<script lang="ts" setup>
import SimpleKeyboard from "./SimpleKeyboard.vue";

interface Props {
  modelValue: string;
  defaultValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultValue: "",
});

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <SimpleKeyboard
    keyboardClass="numpad"
    :layout="['7 8 9', '4 5 6', '1 2 3', '{bksp} 0 {neg}']"
    :display="{ '{bksp}': '<', '{neg}': '-' }"
    @update:modelValue="$emit('update:modelValue', $event)"
    :modelValue="modelValue"
    :defaultValue="defaultValue"
  />
</template>

<style>
.numpad .keyboard-button.v-size--default.special {
  width: 60px;
}
</style>

