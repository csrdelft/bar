export interface Profiel {
  id: string;
  displayName: string;
  scopes: ("BAR:NORMAAL" | "BAR:BEHEER" | "BAR:TRUST")[];
}
