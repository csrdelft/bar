<script lang="ts" setup>
import { onMounted, ref } from "vue";

interface Props {
  modelValue: string;
  layout: string[];
  display: Record<string, string>;
  staggered: boolean;
  keyboardClass: string;
  placeholder: string;
  grabFocus: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  layout: () => ["Q W E R T Y U I O P {bksp}", "A S D F G H J K L {leeg}", "Z X C V B N M {space}"],
  display: () => ({
    "{leeg}": "Leeg",
    "{space}": "Spatie",
    "{bksp}": "Delete",
  }),
  staggered: false,
  keyboardClass: "simple-keyboard",
  placeholder: "",
  grabFocus: false,
});

const emits = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "keypress", key: string): void;
}>();

// TODO: werkt dit?
const textField = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (props.grabFocus && textField.value) {
    textField.value.focus();
  }
});

const onChange = (input: string) => {
  emits("update:modelValue", input);
};
const onKeyPress = (key: string) => {
  emits("keypress", key);

  switch (key) {
    case "{leeg}":
      onChange("");
      break;
    case "{space}":
      onChange(props.modelValue + " ");
      break;
    case "{neg}":
      handleNeg();
      break;
    case "{bksp}":
      onChange(props.modelValue.slice(0, -1));
      break;
    default:
      onChange(props.modelValue + key);
      break;
  }
};
const handleNeg = () => {
  if (props.modelValue && props.modelValue.startsWith("-")) {
    onChange(props.modelValue.slice(1));
  } else if (props.modelValue === "") {
    onChange("-1");
  } else {
    onChange(`-${props.modelValue}`);
  }
};
</script>

<template>
  <div class="d-flex flex-column align-center">
    <v-text-field
      ref="textField"
      :style="{ width: '100%' }"
      :value="modelValue"
      :placeholder="placeholder"
      @update:model-value="onChange"
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

