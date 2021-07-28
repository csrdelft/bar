import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Authorize from '@/views/auth/Authorize.vue';
import AuthCallback from '@/views/auth/AuthCallback.vue';
import Invoer from '@/views/Invoer.vue';
import Login from '@/views/Login.vue';
import Logout from '@/views/auth/Logout.vue';
import Personen from '@/views/Personen.vue';
import Bestellingen from '@/views/Bestellingen.vue';
import { getToken } from '@/token';
import PostLogin from '@/views/PostLogin.vue';

const routes: Array<RouteRecordRaw> = [
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
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
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
    path: '/auth/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/auth/post-login',
    name: 'Welcome',
    component: PostLogin,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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
