import { Trainer } from '@domain/entities/Trainer';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class GetTrainerById {
  constructor(private readonly trainerRepository: ITrainerRepository) {}

  async execute(id: string): Promise<Trainer> {
    const trainer = await this.trainerRepository.findById(id);

    if (!trainer) {
      throw new NotFoundError('Treinador');
    }

    return trainer;
  }
}
