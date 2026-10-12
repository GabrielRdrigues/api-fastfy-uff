import { Prisma } from '@prisma/client';
import {
  CreatePokemonDTO,
  PaginatedPokemons,
  PokemonListFilters,
  UpdatePokemonDTO,
} from '@application/dtos/pokemon';
import { Pokemon } from '@domain/entities/Pokemon';
import { ConflictError } from '@domain/errors/ConflictError';
import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';
import { prisma } from './client';

export class PrismaPokemonRepository implements IPokemonRepository {
  async findAll(filters: PokemonListFilters): Promise<PaginatedPokemons> {
    const normalizedType = filters.type?.toUpperCase();
    // gte/lte são os limites mínimo/máximo. O OR também pega o tipo secundário.
    const where: Prisma.PokemonWhereInput = {
      level: { gte: filters.minLevel, lte: filters.maxLevel },
      ...(normalizedType
        ? {
            OR: [
              { type: { equals: normalizedType, mode: 'insensitive' } },
              { types: { has: normalizedType } },
            ],
          }
        : {}),
    };
    // A página traz só um pedaço;
    const [data, total] = await prisma.$transaction([
      prisma.pokemon.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        // Ex.: página 3 com 10 itens pula os 20 primeiros.
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.pokemon.count({ where }),
    ]);
    return {
      data,
      meta: { page: filters.page, limit: filters.limit, total },
    };
  }

  async findById(id: string): Promise<Pokemon | undefined> {
    return (await prisma.pokemon.findUnique({ where: { id } })) ?? undefined;
  }

  async create(data: CreatePokemonDTO): Promise<Pokemon> {
    const type = (data.type ?? data.types?.[0] ?? 'UNKNOWN').toUpperCase();
    return prisma.$transaction(async (transaction) => {
      if (data.trainerId) {
        await this.checkTeamCapacity(transaction, data.trainerId);
      }

      return transaction.pokemon.create({
        data: {
          ...(data.id ? { id: data.id } : {}),
          pokeApiId: data.pokeApiId,
          name: data.name,
          type,
          types: data.types?.map((item) => item.toUpperCase()) ?? [type],
          hp: data.hp ?? 1,
          attack: data.attack ?? 0,
          defense: data.defense ?? 0,
          speed: data.speed ?? 0,
          baseExperience: data.baseExperience ?? 0,
          height: data.height ?? 0,
          weight: data.weight ?? 0,
          level: data.level ?? 1,
          imageUrl: data.imageUrl,
          // Sem treinador no cadastro, o campo opcional fica null no banco: sem squad.
          trainerId: data.trainerId,
        },
      });
    });
  }

  async update(id: string, data: UpdatePokemonDTO): Promise<Pokemon> {
    // trainerId omitido mantém o vínculo; null libera o Pokémon do time.
    return prisma.$transaction(async (transaction) => {
      if (data.trainerId) {
        await this.checkTeamCapacity(transaction, data.trainerId, id);
      }

      return transaction.pokemon.update({
        where: { id },
        data: {
          ...data,
          ...(data.type
            ? {
                type: data.type.toUpperCase(),
                types: [data.type.toUpperCase()],
              }
            : {}),
        },
      });
    });
  }

  private async checkTeamCapacity(
    transaction: Prisma.TransactionClient,
    trainerId: string,
    pokemonId?: string,
  ): Promise<void> {
    // Um pedido por vez pode ocupar vaga neste squad. O bloqueio dura até salvar.
    // Os valores do template são parâmetros SQL, não texto concatenado na consulta.
    await transaction.$queryRaw`
      SELECT id FROM trainers WHERE id = ${trainerId}::uuid FOR UPDATE
    `;

    // Na edição, não contamos o próprio Pokémon como se fosse um novo integrante.
    const teamSize = await transaction.pokemon.count({
      where: {
        trainerId,
        ...(pokemonId ? { id: { not: pokemonId } } : {}),
      },
    });
    if (teamSize >= 6) {
      throw new ConflictError(
        'O treinador já possui o limite máximo de 6 Pokémons em seu time.',
      );
    }
  }

  async delete(id: string): Promise<Pokemon> {
    return prisma.pokemon.delete({ where: { id } });
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    await prisma.pokemon.update({
      where: { id },
      data: { level: newLevel },
    });
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    return prisma.pokemon.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
      orderBy: { name: 'asc' },
    });
  }

  async count(): Promise<number> {
    return prisma.pokemon.count();
  }

  async countByTrainerId(trainerId: string): Promise<number> {
    return prisma.pokemon.count({ where: { trainerId } });
  }

  async findTeamByTrainerId(trainerId: string): Promise<Pokemon[]> {
    return prisma.pokemon.findMany({
      where: { trainerId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
