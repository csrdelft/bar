<template>
  <v-overlay :value="true">
    <div class="d-flex flex-column align-center">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <span class="pt-2">{{ msg }}</span>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import Vue from "vue";
import csrAuth from "../../auth/csrAuth";

/**
 * Open autorisatie in een nieuw venster en ga terug naar /
 * Ga direct terug naar / als er al een profiel is.
 */
export default Vue.extend({
  name: "Authorize",
  data: () => ({
    msg: "Wachten op autorisatie",
    loading: false
  }),
  methods: {
    async setLoading(msg: string): Promise<void> {
      this.loading = false;
      this.msg = msg;
      // NextTick om er voor te zorgen dat loading update
      await this.$nextTick();
      this.loading = true;
    }
  },
  created(): void {
    if (!this.$store.state.user.tokenData) {
      window.open(csrAuth.token.getUri());

      this.loading = true;

      // Deze methode wordt vanuit een popup geladen door AuthCallback
      window.oauth2Callback = async (uri: string) => {
        await this.setLoading("Token laden...");

        try {
          const token = await csrAuth.token.getToken(uri);
          await this.$store.commit("setToken", token.data);
        } catch (e) {
          //this.$notify({ message: e.message });
          // TODO: Notify
        }

        await this.setLoading("Profiel laden...");

        await this.$store.dispatch("postLogin");

        this.loading = false;

        await this.$router.push("/auth/post-login");
      };
    } else {
      this.$router.push("/auth/post-login");
    }
  }
});
</script>

<style scoped>
</style>
