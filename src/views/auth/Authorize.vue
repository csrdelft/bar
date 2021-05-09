<template>
  <div
    v-loading.fullscreen.lock="loading"
    :element-loading-text="msg"
  >
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import csrAuth from '../../auth/csrAuth';

/**
 * Open autorisatie in een nieuw venster en ga terug naar /
 * Ga direct terug naar / als er al een profiel is.
 */
export default defineComponent({
  name: 'Authorize',
  data: () => ({
    msg: 'Wachten op autorisatie',
    loading: false,
  }),
  methods: {
    async setLoading(msg: string): Promise<void> {
      this.loading = false;
      this.msg = msg;
      // NextTick om er voor te zorgen dat loading update
      await this.$nextTick();
      this.loading = true;
    },
  },
  created(): void {
    if (!this.$store.state.token) {
      window.open(csrAuth.token.getUri());

      this.loading = true;

      // Deze methode wordt vanuit een popup geladen door AuthCallback
      window.oauth2Callback = async (uri: string) => {
        await this.setLoading('Token laden...');

        try {
          await this.$store.commit('setToken', (await csrAuth.token.getToken(uri)).data);
        } catch (e) {
          this.$notify({ message: e.message });
        }

        await this.setLoading('Profiel laden...');

        await this.$store.dispatch('postLogin');

        this.loading = false;

        await this.$router.push('/personen');
      };
    } else {
      this.$router.push('/personen');
    }
  },
});
</script>

<style scoped>

</style>
