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

<script lang="ts">
import Vue from "vue";
import SimpleKeyboard from "@/components/SimpleKeyboard.vue";

export default Vue.extend({
  name: "Keyboard",
  model: {
    prop: "modelValue",
    event: "update:modelValue"
  },
  components: { SimpleKeyboard },
  props: {
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
    },
  },
  methods: {
    emitValue(value: string) {
      let val = value;
      if (val) {
        val = val?.toUpperCase();
      }
      this.$emit("update:modelValue", val);
    }
  }
});
</script>

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
