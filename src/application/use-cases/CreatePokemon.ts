import { CreatePokemonDTO } from '@application/dtos/pokemon';
import { Pokemon } from '@domain/entities/Pokemon';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { AppError } from '@domain/errors/AppError';
import { ConflictError } from '@domain/errors/ConflictError';
import { NotFoundError } from '@domain/errors/NotFoundError';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';

export class CreatePokemon {
  constructor(
    private readonly pokemonRepository: IPokemonRepository,
    private readonly pokemonExternalGateway: PokemonExternalGateway,
  ) {}

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    // Mesmo Pikachu, outro registro: repetir a espécie pode; repetir o ID não.
    if (data.id && (await this.pokemonRepository.findById(data.id))) {
      throw new AppError('Pokémon com este ID já existe.', 409);
    }

    // Sem trainerId, fica sem squad. Com treinador, checamos se há vaga no time.
    if (
      data.trainerId &&
      (await this.pokemonRepository.countByTrainerId(data.trainerId)) >= 6
    ) {
      throw new ConflictError(
        'O treinador já possui o limite máximo de 6 Pokémons em seu time.',
      );
    }

    // O gateway consulta a PokéAPI ou o catálogo offline, conforme o ambiente.
    const external = await this.pokemonExternalGateway.findByName(data.name);
    if (!external) {
      throw new NotFoundError('Pokémon na base oficial da PokeAPI');
    }

    // Os atributos do catálogo sobrescrevem os enviados: nada de inventar HP aqui.
    // O nível e o treinador continuam sendo os escolhidos no cadastro.
    return this.pokemonRepository.create({
      ...data,
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
    });
  }
}
