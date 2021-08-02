<template>
  <h1>Welkom in het bar systeem! {{ profielNaam }}</h1>

  <div v-if="isAdmin">
    <div v-if="vertrouwd">
      <p>Deze locatie is vertrouwd: {{ vertrouwd.naam }}</p>

      <el-button @click="stopVertrouwen">
        Deze locatie niet langer vertrouwen.
      </el-button>
    </div>

    <div v-else>
      <p>
        Door een locatie te vertrouwen wordt het mogelijk voor alle leden om in te
        loggen in het bar systeem. Gebruik deze functie alleen op vertrouwde
        plekken.
      </p>
      <p>
        <el-form :inline="true" @submit.prevent @submit="vertrouw">
          <el-form-item label="Naam van deze locatie">
            <el-input v-model="naam" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="vertrouw"
              >Vertrouw deze locatie</el-button
            >
          </el-form-item>
        </el-form>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BarLocatie } from '@/model';

export default defineComponent({
  name: 'PostLogin',
  data: () => ({
    naam: '',
  }),
  computed: {
    profielNaam(): string {
      return this.$store.state.user.profiel?.displayName ?? '';
    },
    vertrouwd(): BarLocatie | null {
      return this.$store.state.user.locatieToken;
    },
    isAdmin(): boolean {
      return this.$store.state.user.profiel?.scopes.includes('BAR:TRUST') ?? false;
    },
  },
  methods: {
    vertrouw() {
      this.$store.dispatch('vertrouwLocatie', this.naam);
    },
    stopVertrouwen() {
      this.$store.commit('setLocatieToken', null);
    },
  },
});
</script>

<style scoped>
</style>
