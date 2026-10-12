import { randomUUID } from 'node:crypto';
import { Pokemon } from '@domain/entities/Pokemon';
import { CreatePokemonDTO, UpdatePokemonDTO } from '@application/dtos/pokemon';
import { AppError } from '@domain/errors/AppError';

// Implementação da entrega 1 mantida para estudo e futuros testes unitários.
export class InMemoryPokemonRepository {
  private pokemons: Pokemon[] = [];

  async findAll(type?: string): Promise<Pokemon[]> {
    return this.pokemons.filter(
      (pokemon) => !type || pokemon.type.toLowerCase() === type.toLowerCase(),
    );
  }

  async findById(id: string): Promise<Pokemon | undefined> {
    return this.pokemons.find((pokemon) => pokemon.id === id);
  }

  async create(pokemon: CreatePokemonDTO): Promise<Pokemon> {
    if (this.pokemons.some((existing) => existing.id === pokemon.id)) {
      throw new AppError('Pokémon com este ID já existe.', 409);
    }
    const newPokemon: Pokemon = {
      id: pokemon.id ?? randomUUID(),
      pokeApiId: pokemon.pokeApiId ?? null,
      name: pokemon.name,
      type: pokemon.type ?? pokemon.types?.[0] ?? 'UNKNOWN',
      types: pokemon.types ?? [pokemon.type ?? 'UNKNOWN'],
      hp: pokemon.hp ?? 1,
      attack: pokemon.attack ?? 0,
      defense: pokemon.defense ?? 0,
      speed: pokemon.speed ?? 0,
      baseExperience: pokemon.baseExperience ?? 0,
      height: pokemon.height ?? 0,
      weight: pokemon.weight ?? 0,
      level: pokemon.level ?? 1,
      imageUrl: pokemon.imageUrl ?? null,
      trainerId: pokemon.trainerId ?? null,
      createdAt: new Date(),
    };

    this.pokemons.push(newPokemon);
    return newPokemon;
  }

  async update(
    id: string,
    updatedPokemon: UpdatePokemonDTO,
  ): Promise<Pokemon | undefined> {
    const pokemonIndex = this.pokemons.findIndex(
      (pokemon) => pokemon.id === id,
    );
    if (pokemonIndex === -1) {
      return undefined;
    }

    const existingPokemon = this.pokemons[pokemonIndex];
    // Desestrutura o Pokémon existente e mescla com os campos atualizados
    const updated: Pokemon = {
      ...existingPokemon,
      name: updatedPokemon.name ?? existingPokemon.name,
      type: updatedPokemon.type ?? existingPokemon.type,
      hp: updatedPokemon.hp ?? existingPokemon.hp,
      level: updatedPokemon.level ?? existingPokemon.level,
    };
    this.pokemons[pokemonIndex] = updated;

    return updated;
  }

  async delete(id: string): Promise<Pokemon | undefined> {
    const pokemonIndex = this.pokemons.findIndex(
      (pokemon) => pokemon.id === id,
    );
    if (pokemonIndex === -1) {
      return undefined;
    }

    const deletedPokemon = this.pokemons[pokemonIndex];
    this.pokemons.splice(pokemonIndex, 1);
    return deletedPokemon;
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    const pokemon = this.pokemons.find((existing) => existing.id === id);
    if (!pokemon) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }
    pokemon.level = newLevel;
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    return this.pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(term.toLowerCase()),
    );
  }

  async count(): Promise<number> {
    return this.pokemons.length;
  }
}
