import {
  BarLocatie, Bestelling, BestellingInhoud, Persoon, Product, Profiel,
} from '@/model';
import { Data as OAuth2Data } from 'client-oauth2';

export interface State {
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
