<template>
  <div v-loading="loading">
    <div v-if="loggedIn" id="nav">
      <el-affix>
        <el-menu :default-active="currentRoute" mode="horizontal" :router="true">
          <el-menu-item index="/personen">
            Persoonselectie
          </el-menu-item>
<!--          <el-menu-item index="/bestellingen">-->
<!--            Bestellingen-->
<!--          </el-menu-item>-->
          <el-menu-item index="/auth/logout">
            Logout
          </el-menu-item>
        </el-menu>
      </el-affix>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  data: () => ({
    loading: true,
  }),
  computed: {
    loggedIn(): boolean {
      return Boolean(this.$store.state.token);
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-menu a {
  text-decoration: none;
}
</style>
