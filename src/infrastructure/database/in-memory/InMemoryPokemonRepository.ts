import { Pokemon } from '../../../domain/entities/Pokemon';
import { IPokemonRepository } from '../../../domain/repositories/IPokemonRepository';
import { CreatePokemonDTO, UpdatePokemonDTO } from '../../../application/dtos/pokemon';

export class InMemoryPokemonRepository implements IPokemonRepository {
  private pokemons: Pokemon[] = [];

  findAll(): Pokemon[] {
    return this.pokemons;
  }

  findById(id: string): Pokemon | undefined {
    return this.pokemons.find((pokemon) => pokemon.id === id);
  }

  create(pokemon: CreatePokemonDTO): Pokemon {
    const newPokemon: Pokemon = {
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      hp: pokemon.hp,
    };

    this.pokemons.push(newPokemon);
    return newPokemon;
  }

  update(id: string, updatedPokemon: UpdatePokemonDTO): Pokemon | undefined {
    const pokemonIndex = this.pokemons.findIndex((pokemon) => pokemon.id === id);
    if (pokemonIndex === -1) {
      return undefined;
    }

    const existingPokemon = this.pokemons[pokemonIndex];
    // Desestrutura o Pokémon existente e mescla com os campos atualizados
    const updated: Pokemon = { ...existingPokemon, ...updatedPokemon };
    this.pokemons[pokemonIndex] = updated;

    return updated;
  }

  delete(id: string): Pokemon | undefined {
    const pokemonIndex = this.pokemons.findIndex((pokemon) => pokemon.id === id);
    if (pokemonIndex === -1) {
      return undefined;
    }

    const deletedPokemon = this.pokemons[pokemonIndex];
    this.pokemons.splice(pokemonIndex, 1);
    return deletedPokemon;
  }
}