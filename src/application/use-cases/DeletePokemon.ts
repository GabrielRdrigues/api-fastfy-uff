import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { AppError } from '@domain/errors/AppError';

export class DeletePokemon {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: string): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.delete(id);
    if (!pokemon) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }
    return pokemon;
  }
}
