<template>
  <el-container>
    <el-main class="login-main">
      <h1>Barsysteem C.S.R.</h1>
      <p>Welkom <span v-if="vertrouwd">terug</span>
       bij het barsysteem, gebruik je stek account om in te loggen.</p>
      <el-button @click="$router.push('/auth/csr')">Login</el-button>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Login',
  computed: {
    vertrouwd() {
      return !!this.$store.state.user.locatieToken;
    },
  },
  created(): void {
    if (this.$store.state.user.tokenData) {
      this.$router.push('/personen');
    }
  },
});
</script>

<style scoped>
.login-main {
  text-align: center;
}
</style>
