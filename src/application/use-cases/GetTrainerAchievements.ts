import {
  achievementDefinitions,
  getAchievementProgress,
} from '@domain/entities/TrainerAchievement';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { ITrainerAchievementRepository } from '@domain/repositories/ITrainerAchievementRepository';

export class GetTrainerAchievements {
  constructor(
    private readonly trainerRepository: ITrainerRepository,
    private readonly pokemonRepository: IPokemonRepository,
    private readonly achievementRepository: ITrainerAchievementRepository,
  ) {}

  async execute(trainerId: string) {
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) throw new NotFoundError('Treinador');

    const team = await this.pokemonRepository.findTeamByTrainerId(trainerId);
    const savedAchievements =
      await this.achievementRepository.findByTrainerId(trainerId);

    const achievements = achievementDefinitions.map((definition) => {
      const saved = savedAchievements.find(
        (item) => item.code === definition.code,
      );
      const progress = getAchievementProgress(definition.code, team);
      return {
        ...definition,
        unlocked: Boolean(saved),
        unlockedAt: saved?.unlockedAt ?? null,
        progress: saved
          ? definition.target
          : Math.min(progress, definition.target),
      };
    });

    return { trainerId, achievements };
  }
}
