import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class CountPokemons {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(): Promise<number> {
    return this.pokemonRepository.count();
  }
}
