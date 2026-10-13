import { TrainerAchievement } from '@domain/entities/TrainerAchievement';

export interface ITrainerAchievementRepository {
  findByTrainerId(trainerId: string): Promise<TrainerAchievement[]>;
}
