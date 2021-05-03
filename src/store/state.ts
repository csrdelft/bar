import {
  Bestelling,
  BestellingInhoud, Persoon, Product, Profiel,
} from '@/model';
import { Data as OAuth2Data } from 'client-oauth2';

export interface State {
  profiel: Profiel | null
  personen: Record<string, Persoon>
  producten: Record<string, Product>
  selectie: string | null
  tokenData: OAuth2Data | null
}

export interface BestellingState {
  bestellingen: Record<string, Bestelling>
}

export interface InvoerState {
  inhoud: Record<string, BestellingInhoud>
}
