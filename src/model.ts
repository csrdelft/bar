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
