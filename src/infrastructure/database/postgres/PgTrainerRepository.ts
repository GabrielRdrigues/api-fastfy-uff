import { CreateTrainerDTO, UpdateTrainerDTO } from '@application/dtos/trainer';
import { Trainer } from '@domain/entities/Trainer';
import { AppError } from '@domain/errors/AppError';
import { IPgTrainerRepository } from '@domain/repositories/IPgTrainerRepository';
import { postgresPool } from './postgresPool';

function handleUniqueViolation(error: unknown): never {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === '23505'
  ) {
    throw new AppError(
      'Já existe um Treinador cadastrado com este e-mail.',
      409,
    );
  }
  throw error;
}

// Versão com SQL da aula 8, para estudo. A factory atual usa PrismaTrainerRepository.
export class PgTrainerRepository implements IPgTrainerRepository {
  async create(data: CreateTrainerDTO): Promise<Trainer> {
    const query = `
      INSERT INTO trainers (name, email, city)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, city, created_at AS "createdAt"
    `;

    try {
      const result = await postgresPool.query<Trainer>(query, [
        data.name,
        data.email,
        data.city,
      ]);
      return result.rows[0];
    } catch (error) {
      return handleUniqueViolation(error);
    }
  }

  async findAll(): Promise<Trainer[]> {
    const result = await postgresPool.query<Trainer>(`
      SELECT id, name, email, city, created_at AS "createdAt"
      FROM trainers ORDER BY created_at, id
    `);
    return result.rows;
  }

  async findById(id: string): Promise<Trainer | undefined> {
    const result = await postgresPool.query<Trainer>(
      `SELECT id, name, email, city, created_at AS "createdAt" FROM trainers WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  }

  async update(
    id: string,
    data: UpdateTrainerDTO,
  ): Promise<Trainer | undefined> {
    const query = `
      UPDATE trainers
      SET name = COALESCE($2, name), email = COALESCE($3, email), city = COALESCE($4, city)
      WHERE id = $1
      RETURNING id, name, email, city, created_at AS "createdAt"
    `;

    try {
      const result = await postgresPool.query<Trainer>(query, [
        id,
        data.name ?? null,
        data.email ?? null,
        data.city ?? null,
      ]);
      return result.rows[0];
    } catch (error) {
      return handleUniqueViolation(error);
    }
  }
}
