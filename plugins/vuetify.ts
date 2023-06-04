import { ThemeDefinition, createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { nl } from "vuetify/locale";

const myDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "#607D8B",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: "myDarkTheme",
      themes: {
        myDarkTheme,
      },
    },
    locale: {
      locale: "nl",
      messages: { nl },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});

