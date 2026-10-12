import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { ConflictError } from '@domain/errors/ConflictError';
import { NotFoundError } from '@domain/errors/NotFoundError';

const REST_MS = 30 * 60 * 1000;

function trainingExperience(baseExperience: number): number {
  // A experiência-base vem da espécie; o Pokémon individual recebe um quarto
  // dela por treino. Mesmo espécies sem valor informado concedem 1 XP.
  return Math.max(1, Math.floor(baseExperience / 4));
}

export class TrainPokemon {
  constructor(
    private readonly pokemonRepository: Pick<
      IPokemonRepository,
      'findById' | 'saveTraining'
    >,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async execute(id: string) {
    const pokemon = await this.pokemonRepository.findById(id);
    if (!pokemon) throw new NotFoundError('Pokémon');
    if (pokemon.level >= 100) {
      throw new ConflictError('Pokémon já está no nível máximo de 100.');
    }

    const trainedAt = this.now();
    if (pokemon.lastTrainedAt) {
      const nextTrainingAt = new Date(
        pokemon.lastTrainedAt.getTime() + REST_MS,
      );
      if (trainedAt < nextTrainingAt) {
        throw new ConflictError('O Pokémon precisa descansar entre treinos.', [
          { nextTrainingAt: nextTrainingAt.toISOString() },
        ]);
      }
    }

    let level = pokemon.level;
    const gainedExperience = trainingExperience(pokemon.baseExperience);
    let experience = pokemon.experience + gainedExperience;
    while (level < 100 && experience >= 100 * level) {
      experience -= 100 * level;
      level++;
    }

    await this.pokemonRepository.saveTraining(id, {
      level,
      experience,
      lastTrainedAt: trainedAt,
    });

    return {
      gainedExperience,
      leveledUp: level > pokemon.level,
      level,
      experience,
      experienceToNextLevel:
        level === 100 ? null : Math.max(0, 100 * level - experience),
      nextTrainingAt:
        level === 100
          ? null
          : new Date(trainedAt.getTime() + REST_MS).toISOString(),
    };
  }
}
