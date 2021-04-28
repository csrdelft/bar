<template>
  <div class="hello">
    <el-input type="text" :value="upperValue" @input="value = $event.target.value"/>
    <Keyboard :input="upperValue" @onChange="change"/>
    <LedenTable/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Keyboard from '@/components/Keyboard.vue';
import LedenTable from '@/components/LedenTable.vue';

export default defineComponent({
  name: 'Overzicht',
  components: { LedenTable, Keyboard },
  data: () => ({
    value: '',
  }),
  created(): void {
    if (this.$store.state.token) {
      this.$store.dispatch('listUsers');
    }
  },
  computed: {
    upperValue(): string {
      return this.value.toUpperCase();
    },
    naam(): string | null {
      return this.$store.state.profiel?.displayName;
    },
  },
  methods: {
    change(value: string) {
      this.value = value;
      this.$store.commit('setZoeken', value);
    },
  },
});
</script>

<style >
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
