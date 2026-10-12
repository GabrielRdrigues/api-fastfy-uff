import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class SearchPokemons {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(term: string): Promise<Pokemon[]> {
    return this.pokemonRepository.searchByName(term);
  }
}
