import axios, { AxiosInstance } from 'axios';
import { AppError } from '@domain/errors/AppError';
import {
  ExternalPokemonDetails,
  IPokeApiGateway,
} from '@domain/gateways/IPokeApiGateway';

interface PokeApiResponse {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: { other?: { ['official-artwork']?: { front_default?: string } } };
  types: Array<{ type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
}

export class PokeApiAxiosGateway implements IPokeApiGateway {
  constructor(
    private readonly httpClient: Pick<AxiosInstance, 'get'> = axios.create({
      baseURL: 'https://pokeapi.co/api/v2',
      // Sem espera infinita: após 3 segundos, a chamada falha.
      timeout: 3000,
    }),
  ) {}

  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    try {
      const response = await this.httpClient.get<PokeApiResponse>(
        `/pokemon/${encodeURIComponent(name.trim().toLowerCase())}`,
      );
      const data = response.data;
      // Busca pelo nome do atributo, sem depender da ordem enviada pela PokéAPI.
      const stat = (statName: string): number =>
        data.stats.find((item) => item.stat.name === statName)?.base_stat ?? 0;

      // Traduz o formato externo para o que nossa aplicação entende.
      return {
        id: data.id,
        name: data.name,
        spriteUrl:
          data.sprites.other?.['official-artwork']?.front_default ?? null,
        baseExperience: data.base_experience,
        height: data.height,
        weight: data.weight,
        types: data.types.map((item) => item.type.name.toUpperCase()),
        stats: {
          hp: stat('hp'),
          attack: stat('attack'),
          defense: stat('defense'),
          speed: stat('speed'),
        },
      };
    } catch (error) {
      // Não achou o Pokémon? null. Serviço deu ruim? Avisamos com 503.
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }

      throw new AppError(
        'O serviço externo da PokeAPI está temporariamente indisponível. Tente novamente mais tarde',
        503,
        undefined,
        { cause: error },
      );
    }
  }
}
