import { CreatePokemonDTO } from '../dtos/pokemon';
import { Pokemon } from '../../domain/entities/Pokemon';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';

export class CreatePokemon {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute(data: CreatePokemonDTO): Pokemon {
    if (this.pokemonRepository.findById(data.id)) {
      throw new Error('Pokémon com este ID já existe.');
    }

    return this.pokemonRepository.create(data);
  }
}
