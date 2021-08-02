<template>
  <div class="hello">
    <Keyboard v-model="value"/>
    <LedenTable :zoeken="value"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Keyboard from '@/components/Keyboard.vue';
import LedenTable from '@/components/LedenTable.vue';

export default Vue.extend({
  name: 'Personen',
  components: {
    LedenTable,
    Keyboard,
  },
  data: () => ({
    value: '',
  }),
  computed: {
    upperValue(): string {
      return this.value.toUpperCase();
    },
  },
  methods: {
    change(value: string) {
      this.value = value;
    },
  },
});
</script>

<style>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.el-table .error-row td:last-child {
  background: #f2dede;
}

.el-table .success-row td:last-child {
  background: #f0f9eb;
}
</style>
