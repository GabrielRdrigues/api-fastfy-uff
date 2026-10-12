export interface ExternalPokemonDetails {
  id: number;
  name: string;
  spriteUrl: string | null;
  baseExperience: number;
  height: number;
  weight: number;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

export interface PokemonExternalGateway {
  findByName(name: string): Promise<ExternalPokemonDetails | null>;
}
