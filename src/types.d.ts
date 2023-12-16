export interface IPokemonAPI {
  name: string
  url: string
}

export interface IPokemonType {
  name: string
  url: string
}

export interface IPokemon {
  id: number
  name: string
  image: string
  type: string[]
  hp: number
  attack: number
  defense: number
  speed: number
  height: number
  weight: number
}

export interface IPokemonTypeFromDB {
  id: number
  name: string
  image: string
  Types: any[]
  hp: number
  attack: number
  defense: number
  speed: number
  height: number
  weight: number
}
