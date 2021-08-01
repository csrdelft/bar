<template>
  <el-container>
    <el-main>
      <h1>Barsysteem C.S.R.</h1>
      <el-button @click="$router.push('/auth/csr')">Login</el-button>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Login',
  created(): void {
    if (this.$store.state.user.tokenData) {
      this.$router.push('/personen');
    }
  },
});
</script>

<style scoped>

</style>
