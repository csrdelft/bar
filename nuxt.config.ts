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
  modules: ["@pinia/nuxt"],
  css: ["@fortawesome/fontawesome-free/css/all.css", "vuetify/styles"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});

