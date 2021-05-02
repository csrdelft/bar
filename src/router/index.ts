import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Authorize from '@/views/auth/Authorize.vue';
import AuthCallback from '@/views/auth/AuthCallback.vue';
import Bestelling from '@/views/Bestelling.vue';
import Login from '@/views/Login.vue';
import Logout from '@/views/auth/Logout.vue';
import Personen from '@/views/Personen.vue';
import Bestellingen from '@/views/Bestellingen.vue';
import { getToken } from '@/token';

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
    path: '/bestelling/:socCieId',
    name: 'Bestelling',
    component: Bestelling,
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
