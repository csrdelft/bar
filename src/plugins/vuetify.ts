import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import nl from 'vuetify/src/locale/nl';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: "#11273a",
            },
            dark: {
                primary: "#607D8B",
            }
        }
    },
    lang: {
        locales: {nl},
        current: "nl",
    }
});
