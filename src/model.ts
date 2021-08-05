export interface Profiel {
  id: string
  displayName: string
  scopes: ('BAR:NORMAAL' | 'BAR:BEHEER' | 'BAR:TRUST')[]
}

export interface Persoon {
  weergave: string
  status: string
  uid: string
  naam: string
  saldo: number
  recent: number
  deleted: boolean
}

export interface Product {
  id: string
  prijs: number
  beheer: boolean
  beschrijving: string
  prioriteit: number
  status: number
  categorie: string
}

export interface BestellingInhoud {
  product_id: number
  product: Product
  aantal: number
}

export interface Bestelling {
  inhoud: BestellingInhoud[]
  totaal: number
  uid: string
  moment: string
  id: number
  deleted: boolean
  comment: string
  cie: string
}

export interface BarLocatie {
  sleutel: string
  naam: string
}
