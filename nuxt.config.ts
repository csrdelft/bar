export default defineNuxtConfig({
  ssr: false,
  router: {
    base: "/bar/",
  },

  runtimeConfig: {
    public: {
      oauth2ClientId: "bar",
      remoteUrl: "http://localhost:8000",
    },
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

