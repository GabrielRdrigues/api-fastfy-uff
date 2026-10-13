import { ITrainerAchievementRepository } from '@domain/repositories/ITrainerAchievementRepository';
import { prisma } from './client';

export class PrismaTrainerAchievementRepository implements ITrainerAchievementRepository {
  async findByTrainerId(trainerId: string) {
    return prisma.trainerAchievement.findMany({ where: { trainerId } });
  }
}
