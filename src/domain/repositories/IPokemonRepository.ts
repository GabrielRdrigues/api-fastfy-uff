import { Pokemon } from '@domain/entities/Pokemon';
import {
  CreatePokemonDTO,
  PaginatedPokemons,
  PokemonListFilters,
  UpdatePokemonDTO,
} from '@application/dtos/pokemon';

// O contrato diz quais operações existem, sem prender a regra de negócio ao Prisma.
export interface IPokemonRepository {
  findAll(filters: PokemonListFilters): Promise<PaginatedPokemons>;
  findById(id: string): Promise<Pokemon | undefined>;
  create(pokemon: CreatePokemonDTO): Promise<Pokemon>;
  update(
    id: string,
    updatedPokemon: UpdatePokemonDTO,
  ): Promise<Pokemon | undefined>;
  delete(id: string): Promise<Pokemon | undefined>;
  updateLevel(id: string, newLevel: number): Promise<void>;
  searchByName(term: string): Promise<Pokemon[]>;
  count(): Promise<number>;
  countByTrainerId(trainerId: string): Promise<number>;
  findTeamByTrainerId(trainerId: string): Promise<Pokemon[]>;
}
