export class CreatePokemonDto {
  id!: number;
  name!: string;
  image!: string;
  hp!: number;
  attack!: number;
  defense!: number;
  speed!: number;
  height!: number;
  weight!: number;
  userCreated!: boolean;
  type!: { name: string; url: string }[];
}
