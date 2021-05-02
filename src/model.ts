export interface Profiel {
  id: string
  displayName: string
}

export interface Persoon {
  naam: string
  status: string
  socCieId: string
  bijnaam: string
  saldo: number
  recent: number
  deleted: string
}

export interface Product {
  productId: string
  prijs: string
  beheer: string
  beschrijving: string
  prioriteit: string
  status: string
  cie: string
}

export interface BestellingInhoud {
  product: Product
  aantal: number
}

export interface Bestelling {
  // Record<productId, aantal>
  bestelLijst: Record<string, string>
  bestelTotaal: string
  persoon: string
  tijd: string
  bestelId: string
  deleted: string
  oud: boolean
}
