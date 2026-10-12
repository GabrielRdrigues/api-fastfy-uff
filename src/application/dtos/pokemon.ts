import { Pokemon } from '@domain/entities/Pokemon';

// DTO é o pacote de dados entre camadas. Também recebe os atributos do catálogo,
// então tem mais campos que o JSON aceito pela rota; o Zod define essa entrada.
export interface CreatePokemonDTO {
  id?: string;
  pokeApiId?: number;
  name: string;
  type?: string;
  types?: string[];
  hp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  baseExperience?: number;
  height?: number;
  weight?: number;
  level?: number;
  imageUrl?: string;
  trainerId?: string;
}

export interface UpdatePokemonDTO {
  name?: string;
  type?: string;
  hp?: number;
  level?: number;
  trainerId?: string | null;
}

export interface PokemonListFilters {
  page: number;
  limit: number;
  type?: string;
  minLevel: number;
  maxLevel: number;
}

export interface PaginatedPokemons {
  data: Pokemon[];
  meta: { page: number; limit: number; total: number };
}
