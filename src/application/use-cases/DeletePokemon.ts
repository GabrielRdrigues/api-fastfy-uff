import { Pokemon } from '../../domain/entities/Pokemon';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';

export class DeletePokemon {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute(id: string): Pokemon | undefined {
    return this.pokemonRepository.delete(id);
  }
}
