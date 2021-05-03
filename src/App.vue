<template>
  <el-container v-if="loggedIn" v-loading="loading">

    <el-header height="auto">
      <el-affix>
        <el-menu :default-active="currentRoute" mode="horizontal" :router="true">
          <el-menu-item index="/personen">
            Persoonselectie
          </el-menu-item>
          <el-menu-item index="/bestellingen">
            Bestellingen
          </el-menu-item>
          <el-menu-item index="/auth/logout">
            Logout
          </el-menu-item>
        </el-menu>
        <PersoonSelectie/>
      </el-affix>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
  <el-container v-else>
    <el-main>
      <router-link to="/auth/csr">Login</router-link>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getToken } from '@/token';
import PersoonSelectie from '@/components/PersoonSelectie.vue';

export default defineComponent({
  name: 'App',
  components: { PersoonSelectie },
  data: () => ({
    loading: true,
  }),
  computed: {
    loggedIn(): boolean {
      return Boolean(getToken());
    },
    currentRoute(): string {
      return this.$router.currentRoute.value.fullPath;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$store.dispatch('postLogin')
        .then((): void => {
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  },
});
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.el-menu a {
  text-decoration: none;
}
</style>
