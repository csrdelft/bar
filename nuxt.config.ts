import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: false,
  router: {
    base: "/bar/",
  },

  runtimeConfig: {
    public: {
      authId: "bar",
      remoteUrl:
        process.env.NODE_ENV !== "production" ? process.env.NUXT_REMOTE_URL : "https://csrdelft.nl",
      origin:
        process.env.NODE_ENV !== "production" ? process.env.AUTH_ORIGIN : "https://bar.csrdelft.nl",
    },
    authSecret: process.env.NUXT_AUTH_SECRET,
    secret: process.env.NUXT_SECRET,
  },

  buildModules: ["nuxt-typed-router"],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],

  css: ["@mdi/font/css/materialdesignicons.css", "vuetify/lib/styles/main.sass"],
  build: {
    transpile: ["vuetify", "@vuepic/vue-datepicker"],
  },

  devtools: { enabled: true },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
