import Vue, { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { Bestelling, BestellingInhoud, Persoon, Product, BarLocatie, Profiel } from './model'
import { OAuth2Data } from 'client-oauth2'
import { State} from './store/state'


  // interface State {
  //   personen: Record<string, Persoon>
  //   producten: Record<string, Product>

  //   bestelling: BestellingState
  //   invoer: InvoerState
  //   user: UserState
  // }

  // interface BestellingState {
  //   bestellingen: Record<string, Bestelling>
  // }

  // interface InvoerState {
  //   inhoud: Record<string, BestellingInhoud>
  // }

  // interface UserState {
  //   profiel: Profiel | null,
  //   selectie: string | null
  //   tokenData: OAuth2Data | null
  //   locatieToken: BarLocatie | null
  // }


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