import { UpdateTrainerDTO } from '@application/dtos/trainer';
import { Trainer } from '@domain/entities/Trainer';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class UpdateTrainer {
  constructor(private readonly trainerRepository: ITrainerRepository) {}

  async execute(id: string, data: UpdateTrainerDTO): Promise<Trainer> {
    const trainer = await this.trainerRepository.update(id, {
      name: data.name?.trim(),
      email: data.email?.trim().toLowerCase(),
      city: data.city?.trim(),
    });

    if (!trainer) {
      throw new NotFoundError('Treinador');
    }

    return trainer;
  }
}
