import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { NotFoundError } from '@domain/errors/NotFoundError';

export class GetPokemonById {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findById(id);
    if (!pokemon) {
      throw new NotFoundError('Pokémon');
    }
    return pokemon;
  }
}
