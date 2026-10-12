import { CreateTrainerDTO, UpdateTrainerDTO } from '@application/dtos/trainer';
import { Trainer } from '@domain/entities/Trainer';

// antigo quando a gente usava o driver
export interface IPgTrainerRepository {
  create(data: CreateTrainerDTO): Promise<Trainer>;
  findAll(): Promise<Trainer[]>;
  findById(id: string): Promise<Trainer | undefined>;
  update(id: string, data: UpdateTrainerDTO): Promise<Trainer | undefined>;
}
