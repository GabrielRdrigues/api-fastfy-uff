import { Trainer } from '@domain/entities/Trainer';
import { AppError } from '@domain/errors/AppError';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class GetTrainerById {
  constructor(private readonly trainerRepository: ITrainerRepository) {}

  async execute(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);

    if (!trainer) {
      throw new AppError('Treinador não encontrado.', 404);
    }

    return trainer;
  }
}
