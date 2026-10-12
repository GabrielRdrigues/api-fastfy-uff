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
// Definir a interface de como a aplicação consulta a Poke API
export interface IPokeApiGateway {
  findByName(name: string): Promise<ExternalPokemonDetails | null>;
}
