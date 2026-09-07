export interface CreatePokemonDTO {
  id: string;
  name: string;
  type: string;
  hp: number;
}

export interface UpdatePokemonDTO {
  name?: string;
  type?: string;
  hp?: number;
}
