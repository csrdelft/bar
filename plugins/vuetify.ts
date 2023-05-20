import "@fortawesome/fontawesome-free/css/all.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: "fa",
      aliases,
      sets: {
        fa,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});

