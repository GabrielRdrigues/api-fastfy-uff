import { NotFoundError } from '@domain/errors/NotFoundError';
import {
  ExternalPokemonDetails,
  IPokeApiGateway,
} from '@domain/gateways/IPokeApiGateway';

export interface PokedexPokemon {
  id: number;
  name: string;
  imageUrl: string | null;
  baseExperience: number;
  height: number;
  weight: number;
  types: string[];
  stats: ExternalPokemonDetails['stats'];
}

export class SearchPokedex {
  constructor(private readonly pokeApiGateway: IPokeApiGateway) {}

  async execute(name: string): Promise<PokedexPokemon> {
    // Aqui é só dar uma olhada na Pokédex: consultar não salva nem captura.
    const pokemon = await this.pokeApiGateway.findByName(name);
    if (!pokemon) throw new NotFoundError('Pokémon na PokéAPI');
    return {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: pokemon.spriteUrl,
      baseExperience: pokemon.baseExperience,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types,
      stats: pokemon.stats,
    };
  }
}
