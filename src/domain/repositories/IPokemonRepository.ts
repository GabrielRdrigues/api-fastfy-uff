import { Pokemon } from '../entities/Pokemon';
import { CreatePokemonDTO, UpdatePokemonDTO } from '../../application/dtos/pokemon';

export interface IPokemonRepository {
  findAll(): Pokemon[];
  findById(id: string): Pokemon | undefined;
  create(pokemon: CreatePokemonDTO): Pokemon;
  update(id: string, updatedPokemon: UpdatePokemonDTO): Pokemon | undefined;
  delete(id: string): Pokemon | undefined;
}