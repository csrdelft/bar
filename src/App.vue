<template>
  <el-container v-loading="loading">
    <el-header v-if="loggedIn" height="auto">
      <el-affix>
        <el-menu :default-active="currentRoute.fullPath" mode="horizontal" :router="true">
          <el-menu-item index="/personen">
            Persoonselectie
          </el-menu-item>
          <el-menu-item :disabled="bestellingUrl == null" :index="bestellingUrl">
            Invoer
          </el-menu-item>
          <el-menu-item index="/bestellingen">
            Bestellingen
          </el-menu-item>
          <el-menu-item index="/auth/logout">
            Logout
          </el-menu-item>
          <el-menu-item class="klok">
            <Clock/>
          </el-menu-item>
        </el-menu>
        <PersoonSelectie/>
      </el-affix>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PersoonSelectie from '@/components/PersoonSelectie.vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import Clock from '@/components/Clock.vue';

export default defineComponent({
  name: 'App',
  components: { Clock, PersoonSelectie },
  data: () => ({
    loading: true,
  }),
  computed: {
    loggedIn(): boolean {
      return Boolean(this.$store.getters.token);
    },
    currentRoute(): RouteLocationNormalizedLoaded {
      return this.$router.currentRoute.value;
    },
    bestellingUrl(): string|null {
      const { selectie } = this.$store.state;

      if (selectie) {
        return `/invoer/${selectie}`;
      }

      return null;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$store.dispatch('postLogin')
        .then((): void => {
          this.loading = false;
        })
        .catch(() => {
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
}

.el-menu a {
  text-decoration: none;
}

.el-page-header {
  background: white;
}
.el-page-header__content, .el-page-header__title {
  float: left;
  height: 60px;
  line-height: 60px;
  margin: 0;
  color: #909399;
}

.el-menu--horizontal > .el-menu-item.klok {
  float: right;
}
</style>
