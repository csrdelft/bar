import { VueConstructor } from "vue/types/umd";
import Index from "./components/Index.vue";

export default {
  install(Vue : VueConstructor, options : {vuetify?: any, options?: any, container?: string} = {}) {
    const extendComponent = Vue.extend(Index);

    const instance = new extendComponent({
      vuetify: options.vuetify,
      data: {
        options: options.options
      }
    });

    Vue.prototype.$nextTick(() => {
      Vue.prototype.$notify = instance.$mount();
      document.getElementById(options.container || "app")?.appendChild(instance.$el);
    });
  }
};