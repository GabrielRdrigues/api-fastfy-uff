import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class DeleteTrainer {
  constructor(private readonly trainerRepository: ITrainerRepository) {}

  async execute(id: string): Promise<void> {
    await this.trainerRepository.delete(id);
  }
}
