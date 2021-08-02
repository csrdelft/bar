<template>
  <el-container>
    <el-main class="logout-main">
      <h1>Weet je zeker dat je wil uitloggen?</h1>
      <el-button @click="logout" type="primary">Uitloggen</el-button>
      <el-button @click="$router.push('/')">Terug</el-button>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Logout',
  methods: {
    logout(): void {
      this.$store.commit('setToken', null);
      this.$router.push('/');
    },
  },
});
</script>

<style scoped>
.logout-main {
  text-align: center;
}
</style>
