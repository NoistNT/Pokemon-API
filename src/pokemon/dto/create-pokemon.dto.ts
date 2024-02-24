export class CreatePokemonDto {
  id!: string;
  name!: string;
  image!: string;
  hp!: number;
  attack!: number;
  defense!: number;
  speed!: number;
  height!: number;
  weight!: number;
  type!: Array<string>;
}
