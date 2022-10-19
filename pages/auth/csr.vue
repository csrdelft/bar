<script lang="ts" setup>
import { useUserStore } from "~/stores/user";
import { useTypedRouter } from "~/generated";
import { useCsrAuth } from "~/composables/useCsrAuth";

/**
 * Open autorisatie in een nieuw venster en ga terug naar /
 * Ga direct terug naar / als er al een profiel is.
 */
const loading = ref(false);
const loadingMessage = ref("Wachten op autorisatie");

const setLoading = async (msg: string) => {
  loading.value = true;
  loadingMessage.value = msg;
};

const { router, routes } = useTypedRouter();
const user = useUserStore();
const { oauthClient } = useCsrAuth();

onMounted(async () => {
  if (!user.tokenData) {
    window.open(oauthClient.token.getUri({ query: { "remote-login": "true" } }));

    // Deze methode wordt vanuit een popup geladen door AuthCallback
    window.oauth2Callback = async (uri: string) => {
      await setLoading("Token laden...");

      try {
        const token = await oauthClient.token.getToken(uri);
        await user.setToken(token.data);
      } catch (e) {
        //this.$notify({ message: e.message });
        // TODO: Notify
        console.error(e);
      }

      await router.push({ name: routes.index });
    };
  } else {
    await router.push({ name: routes.index });
  }
});
</script>

<template>
  <v-overlay :value="true">
    <div class="d-flex flex-column align-center">
      <v-progress-circular indeterminate :size="64"></v-progress-circular>
      <span class="pt-2">{{ loadingMessage }}</span>
    </div>
  </v-overlay>
</template>

