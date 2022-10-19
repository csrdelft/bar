<script lang="ts" setup>
import SimpleKeyboard from "./SimpleKeyboard.vue";

interface Props {
  modelValue: string;
  placeholder: string;
  grabFocus: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  grabFocus: false,
});

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const emitValue = (value: string) => {
  let val = value;
  if (val) {
    val = val?.toUpperCase();
  }
  emits("update:modelValue", val);
};
</script>

<template>
  <SimpleKeyboard
    @update:modelValue="emitValue"
    :modelValue="modelValue"
    keyboard-class="full-keyboard"
    staggered
    :placeholder="placeholder"
    :grab-focus="grabFocus"
  />
</template>

<style>
.full-keyboard .hg-row {
  justify-content: center;
}

.full-keyboard .hg-button {
  font-size: 2em;
  flex-grow: 0;
  padding: 1em;
}

.full-keyboard .hg-button.hg-standardBtn {
  height: 100%;
}

.full-keyboard .hg-button.hg-functionBtn {
  height: 100%;
}
</style>

