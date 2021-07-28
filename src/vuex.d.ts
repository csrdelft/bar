import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { Bestelling, BestellingInhoud, Persoon, Product, BarLocatie, Profiel } from './model'
import { OAuth2Data } from 'client-oauth2'

declare module '@vue/runtime-core' {

  interface State {
    personen: Record<string, Persoon>
    producten: Record<string, Product>

    bestelling: BestellingState
    invoer: InvoerState
    user: UserState
  }

  export interface BestellingState {
    bestellingen: Record<string, Bestelling>
  }

  export interface InvoerState {
    inhoud: Record<string, BestellingInhoud>
  }

  export interface UserState {
    profiel: Profiel | null,
    selectie: string | null
    tokenData: OAuth2Data | null
    locatieToken: BarLocatie | null
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
    $loading: (...args: unknown[]) => unknown
    $message: ((...args: unknown[]) => unknown) & { error: (...args: unknown[]) => unknown }
    $notify: (...args: unknown[]) => unknown
  }
}
