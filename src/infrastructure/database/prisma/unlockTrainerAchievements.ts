import { Prisma } from '@prisma/client';
import {
  achievementDefinitions,
  getAchievementProgress,
} from '@domain/entities/TrainerAchievement';

export async function unlockTrainerAchievements(
  transaction: Prisma.TransactionClient,
  trainerId: string | null,
): Promise<void> {
  if (!trainerId) return;

  const team = await transaction.pokemon.findMany({
    where: { trainerId },
    select: { level: true },
  });

  for (const achievement of achievementDefinitions) {
    const progress = getAchievementProgress(achievement.code, team);
    if (progress >= achievement.target) {
      // Ignorar duplicatas mantém a data da primeira conquista.
      await transaction.trainerAchievement.createMany({
        data: [{ trainerId, code: achievement.code }],
        skipDuplicates: true,
      });
    }
  }
}
