import Vue, { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { Bestelling, BestellingInhoud, Persoon, Product, BarLocatie, Profiel } from './model'
import { OAuth2Data } from 'client-oauth2'
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