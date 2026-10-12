import { CreateTrainerDTO } from '@application/dtos/trainer';
import { Trainer } from '@domain/entities/Trainer';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class CreateTrainer {
  constructor(private readonly trainerRepository: ITrainerRepository) {}

  async execute(data: CreateTrainerDTO): Promise<Trainer> {
    // E-mail vai em minúsculas: trocar só a caixa não libera uma conta duplicada.
    // Quem garante a exclusividade é a restrição UNIQUE no banco.
    return this.trainerRepository.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      city: data.city.trim(),
    });
  }
}
