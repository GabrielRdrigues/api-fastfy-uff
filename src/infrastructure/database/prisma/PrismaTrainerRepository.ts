import { Prisma } from '@prisma/client';
import { CreateTrainerDTO, UpdateTrainerDTO } from '@application/dtos/trainer';
import { Trainer } from '@domain/entities/Trainer';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';
import { prisma } from './client';
import { PrismaErrorMapper } from './PrismaErrorMapper';

export class PrismaTrainerRepository implements ITrainerRepository {
  async create(data: CreateTrainerDTO): Promise<Trainer> {
    return prisma.trainer.create({ data });
  }

  async findAll(): Promise<Trainer[]> {
    return prisma.trainer.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async findById(id: string): Promise<Trainer | undefined> {
    return (await prisma.trainer.findUnique({ where: { id } })) ?? undefined;
  }

  async update(id: string, data: UpdateTrainerDTO): Promise<Trainer> {
    return prisma.trainer.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    // O treinador sai, mas o squad fica vivo: tiramos só o vínculo dos Pokémon.
    // A transação é tudo ou nada; se a exclusão falhar, desfaz a liberação também.
    try {
      await prisma.$transaction(async (transaction) => {
        // Usa a mesma ordem de bloqueio da captura: treinador antes dos Pokémon.
        await transaction.$queryRaw`
          SELECT id FROM trainers WHERE id = ${id}::uuid FOR UPDATE
        `;
        await transaction.pokemon.updateMany({
          where: { trainerId: id },
          data: { trainerId: null },
        });
        await transaction.trainer.delete({ where: { id } });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw PrismaErrorMapper.toAppError(
          error,
          'Treinador não encontrado para exclusão',
        );
      }
      throw error;
    }
  }
}
