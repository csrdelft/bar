import { Product } from "./product";

export interface Bestelling {
  inhoud: BestellingInhoud[];
  totaal: number;
  uid: string;
  moment: string;
  id: number;
  deleted: boolean;
  comment: string;
  cie: string;
}

export interface BestellingInhoud {
  // product_id: number
  product: Product;
  aantal: number;
}

