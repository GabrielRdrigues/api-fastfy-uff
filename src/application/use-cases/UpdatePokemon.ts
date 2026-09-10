import { UpdatePokemonDTO } from '../dtos/pokemon';
import { Pokemon } from '../../domain/entities/Pokemon';
import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';

export class UpdatePokemon {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  execute(id: string, data: UpdatePokemonDTO): Pokemon | undefined {
    return this.pokemonRepository.update(id, data);
  }
}
