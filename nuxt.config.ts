import { defineNuxtConfig } from "nuxt";
import TypedRouter from "nuxt-typed-router";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  router: {
    base: "/bar/",
  },

  buildModules: [TypedRouter],
  nuxtTypedRouter: {
    outDir: "./generated",
  },
});

