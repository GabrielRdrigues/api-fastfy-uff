import {
  PaginatedPokemons,
  PokemonListFilters,
} from '@application/dtos/pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class ListPokemons {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(filters: PokemonListFilters): Promise<PaginatedPokemons> {
    return this.pokemonRepository.findAll(filters);
  }
}
