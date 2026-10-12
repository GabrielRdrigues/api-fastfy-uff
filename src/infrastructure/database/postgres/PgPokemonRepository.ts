import { CreatePokemonDTO, UpdatePokemonDTO } from '@application/dtos/pokemon';
import { Pokemon } from '@domain/entities/Pokemon';
import { AppError } from '@domain/errors/AppError';
import { postgresPool } from './postgresPool';

// Implementação da aula 8 mantida como referência; a aplicação usa Prisma na etapa 2.
export class PgPokemonRepository {
  async findAll(type?: string): Promise<Pokemon[]> {
    const result = await postgresPool.query<Pokemon>(
      `SELECT id, name, type, hp, level FROM pokemons
       WHERE ($1::text IS NULL OR LOWER(type) = LOWER($1))
       ORDER BY id`,
      [type ?? null],
    );
    return result.rows;
  }

  async findById(id: string): Promise<Pokemon | undefined> {
    const result = await postgresPool.query<Pokemon>(
      'SELECT id, name, type, hp, level FROM pokemons WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }

  async create(pokemon: CreatePokemonDTO): Promise<Pokemon> {
    try {
      const result = await postgresPool.query<Pokemon>(
        `INSERT INTO pokemons (id, name, type, hp, level)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, type, hp, level`,
        [
          pokemon.id,
          pokemon.name,
          pokemon.type,
          pokemon.hp,
          pokemon.level ?? 1,
        ],
      );
      return result.rows[0];
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new AppError('Pokémon com este ID já existe.', 409);
      }
      throw error;
    }
  }

  async update(
    id: string,
    pokemon: UpdatePokemonDTO,
  ): Promise<Pokemon | undefined> {
    const result = await postgresPool.query<Pokemon>(
      `UPDATE pokemons
       SET name = COALESCE($2, name), type = COALESCE($3, type),
           hp = COALESCE($4, hp), level = COALESCE($5, level)
       WHERE id = $1
       RETURNING id, name, type, hp, level`,
      [
        id,
        pokemon.name ?? null,
        pokemon.type ?? null,
        pokemon.hp ?? null,
        pokemon.level ?? null,
      ],
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<Pokemon | undefined> {
    const result = await postgresPool.query<Pokemon>(
      'DELETE FROM pokemons WHERE id = $1 RETURNING id, name, type, hp, level',
      [id],
    );
    return result.rows[0];
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    const result = await postgresPool.query(
      'UPDATE pokemons SET level = $2 WHERE id = $1',
      [id, newLevel],
    );
    if (result.rowCount === 0) {
      throw new AppError('Pokémon não encontrado no catálogo.', 404);
    }
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const result = await postgresPool.query<Pokemon>(
      'SELECT id, name, type, hp, level FROM pokemons WHERE name ILIKE $1 ORDER BY id',
      [`%${term}%`],
    );
    return result.rows;
  }

  async count(): Promise<number> {
    const result = await postgresPool.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM pokemons',
    );
    return Number(result.rows[0].count);
  }
}
