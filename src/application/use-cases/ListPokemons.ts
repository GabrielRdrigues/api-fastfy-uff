import { Pokemon } from '../../domain/entities/Pokemon';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';

export class ListPokemons {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute(type?: string): Pokemon[] {
    const pokemons = this.pokemonRepository.findAll();

    if (!type) {
      return pokemons;
    }

    return pokemons.filter(
      (pokemon) => pokemon.type.toLowerCase() === type.toLowerCase(),
    );
  }
}
