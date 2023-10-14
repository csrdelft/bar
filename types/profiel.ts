export interface Profiel {
  id: string;
  displayName: string;
  slug: string;
  scopes: ("BAR:NORMAAL" | "BAR:BEHEER" | "BAR:TRUST")[];
}
