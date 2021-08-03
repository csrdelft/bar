import VueRouter, { RouteConfig } from 'vue-router';
import Authorize from '@/views/auth/Authorize.vue';
import AuthCallback from '@/views/auth/AuthCallback.vue';
import Invoer from '@/views/Invoer.vue';
import Login from '@/views/Login.vue';
import Logout from '@/views/Logout.vue';
import AuthLogout from '@/views/auth/AuthLogout.vue';
import Personen from '@/views/Personen.vue';
import Bestellingen from '@/views/Bestellingen.vue';
import { getToken } from '@/token';
import PostLogin from '@/views/PostLogin.vue';
import Vue from 'vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Login,
  },
  {
    path: '/personen',
    name: 'Persoonselectie',
    component: Personen,
  },
  {
    path: '/invoer/:socCieId',
    name: 'Invoer',
    component: Invoer,
    props: true,
  },
  {
    path: '/invoer/:socCieId/bewerken/:bestellingId',
    name: 'Invoer bewerken',
    component: Invoer,
    props: true,
  },
  {
    path: '/bestellingen',
    name: 'Bestellingen',
    component: Bestellingen,
  },
  {
    path: '/auth/csr',
    name: 'Authorize',
    component: Authorize,
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/auth/logout',
    name: 'AuthLogout',
    component: AuthLogout,
  },
  {
    path: '/auth/post-login',
    name: 'Welcome',
    component: PostLogin,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (!(to.path === '/' || to.path.startsWith('/auth'))) {
    const token = getToken();
    if (!token) {
      next({ path: '/' });
      return;
    }
  }

  next();
});

export default router;
