import Vue from 'vue'
import { Store } from 'vuex'
import { State} from './store/state'

declare module "vue/types/vue" {
    interface Vue {
      $store: Store<State>;
    }
  }
  

declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
      store?: Store<State>;
    }
  }