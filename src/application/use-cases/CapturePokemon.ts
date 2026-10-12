import { Pokemon } from '@domain/entities/Pokemon';
import { ConflictError } from '@domain/errors/ConflictError';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { ITrainerRepository } from '@domain/repositories/ITrainerRepository';

export class CapturePokemon {
  constructor(
    private readonly trainerRepository: ITrainerRepository,
    private readonly pokemonRepository: IPokemonRepository,
    private readonly pokeApiGateway: PokemonExternalGateway,
  ) {}

  async execute(trainerId: string, name: string, level = 1): Promise<Pokemon> {
    // Primeiro confere se o dono do squad existe; depois vê se cabe mais um.
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) throw new NotFoundError('Treinador');

    // Checagem rápida; o repositório confere de novo dentro da transação ao salvar.
    if ((await this.pokemonRepository.countByTrainerId(trainerId)) >= 6) {
      throw new ConflictError(
        'O treinador já possui o limite máximo de 6 Pokémons em seu time.',
      );
    }

    const external = await this.pokeApiGateway.findByName(name);
    if (!external) throw new NotFoundError('Pokémon na PokéAPI');

    // Capturar cria um registro novo, já com treinador. Não pega um Pokémon do banco.
    return this.pokemonRepository.create({
      pokeApiId: external.id,
      name: external.name,
      type: external.types[0],
      types: external.types,
      hp: external.stats.hp,
      attack: external.stats.attack,
      defense: external.stats.defense,
      speed: external.stats.speed,
      imageUrl: external.spriteUrl ?? undefined,
      baseExperience: external.baseExperience,
      height: external.height,
      weight: external.weight,
      trainerId,
      level,
    });
  }
}
