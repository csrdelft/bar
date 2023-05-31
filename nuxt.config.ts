export default defineNuxtConfig({
  ssr: false,
  router: {
    base: "/bar/",
  },

  runtimeConfig: {
    public: {
      authId: "bar",
      remoteUrl: process.env.NODE_ENV === "development" ? process.env.NUXT_REMOTE_URL : "https://csrdelft.nl",
      origin: process.env.NODE_ENV === "development" ? process.env.AUTH_ORIGIN : "https://bar.csrdelft.nl",
    },
    authSecret: process.env.NUXT_AUTH_SECRET,
    secret: process.env.NUXT_SECRET,
  },

  buildModules: ["nuxt-typed-router"],
  modules: ["@pinia/nuxt", "@vueuse/nuxt"],
  css: ["@fortawesome/fontawesome-free/css/all.min.css", "vuetify/lib/styles/main.sass"],
  build: {
    transpile: ["vuetify", "@vuepic/vue-datepicker"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});

