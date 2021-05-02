<template>
  <div
    v-loading.fullScreen.lock="loading"
    :element-loading-text="msg"
  >
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import store from '@/store';
import { getToken, setToken } from '@/token';
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
      await this.$nextTick();
      this.loading = true;
    },
  },
  created(): void {
    if (!getToken()) {
      window.open(csrAuth.token.getUri());

      this.loading = true;

      // Deze methode wordt vanuit een popup geladen door AuthCallback
      window.oauth2Callback = async (uri: string) => {
        await this.setLoading('Token laden...');

        const token = await csrAuth.token.getToken(uri);

        setToken(token);

        await this.setLoading('Profiel laden...');

        await store.dispatch('postLogin');

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
