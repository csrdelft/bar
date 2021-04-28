<template>
  <div class="hello">
    <h1>{{ msg }} {{ naam }}</h1>
    <input type="text" :value="upperValue" @input="value = $event.target.value"/>
    <Keyboard :input="upperValue" @onChange="change"/>

    <table>
      <tr v-for="persoon in personen" :key="persoon.socCieId" :id="'persoon' + persoon.socCieId">
        <td>{{ persoon.bijnaam }}</td>
        <td>{{ persoon.naam }}</td>
        <td :class="(persoon.saldo < 0 ? 'bg-danger' : 'bg-success')">
          {{ saldoStr(persoon.saldo) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Keyboard from '@/components/Keyboard.vue';
import { Persoon } from '@/model';

export default defineComponent({
  name: 'HelloWorld',
  components: { Keyboard },
  props: {
    msg: String,
  },
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
    personen(): Persoon[] {
      const personen: Persoon[] = this.$store.state.personen.slice();
      personen.sort((a, b) => b.recent - a.recent);
      return personen.filter((persoon) => persoon.deleted === '0').filter(this.filterPersoon);
    },
  },
  methods: {
    change(value: string) {
      this.value = value;
    },
    filterPersoon(persoon: Persoon) {
      return persoon.bijnaam.toUpperCase().match(this.value)
        || persoon.naam.toUpperCase().match(this.value);
    },
    saldoStr(saldo: number) {
      let achterKomma = String(Math.abs(saldo % 100));
      if (achterKomma === '0') {
        achterKomma = '00';
      } else if (Number(achterKomma) < 10) {
        achterKomma = `0${achterKomma}`;
      }

      if (saldo > -100 && saldo < 0) return `€-0,${achterKomma}`;

      const string = `€${(saldo - (saldo % 100)) / 100},${achterKomma}`;

      return string.replace('€-', '-€');
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
