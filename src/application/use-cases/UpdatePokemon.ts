import { UpdatePokemonDTO } from '@application/dtos/pokemon';
import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { AppError } from '@domain/errors/AppError';
import { ConflictError } from '@domain/errors/ConflictError';

export class UpdatePokemon {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: string, data: UpdatePokemonDTO): Promise<Pokemon> {
    if (data.trainerId) {
      const currentPokemon = await this.pokemonRepository.findById(id);
      if (!currentPokemon) {
        throw new AppError('Pokémon não encontrado no catálogo.', 404);
      }

      // Quem já está no squad não ocupa outra vaga ao editar o próprio cadastro.
      if (
        data.trainerId !== currentPokemon.trainerId &&
        (await this.pokemonRepository.countByTrainerId(data.trainerId)) >= 6
      ) {
        throw new ConflictError(
          'O treinador já possui o limite máximo de 6 Pokémons em seu time.',
        );
      }
    }

    const pokemon = await this.pokemonRepository.update(id, data);
    if (!pokemon) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }
    return pokemon;
  }
}
