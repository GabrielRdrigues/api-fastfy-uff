import { Pokemon } from '@domain/entities/Pokemon';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class GetTrainerTeam {
  constructor(
    private readonly trainerRepository: ITrainerRepository,
    private readonly pokemonRepository: IPokemonRepository,
  ) {}

  async execute(trainerId: string): Promise<Pokemon[]> {
    // Time vazio é válido; treinador inexistente é outro rolê e retorna 404.
    if (!(await this.trainerRepository.findById(trainerId))) {
      throw new NotFoundError('Treinador');
    }
    return this.pokemonRepository.findTeamByTrainerId(trainerId);
  }
}
