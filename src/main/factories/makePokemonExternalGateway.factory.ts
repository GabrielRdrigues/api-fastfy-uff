import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { InMemoryPokemonGateway } from '@infrastructure/gateways/in-memory-pokemon-gateway';
import { PokeApiAxiosGateway } from '@infrastructure/gateways/poke-api-axios-gateway';
import { env } from '@main/config/env';

export function makePokemonExternalGateway(): PokemonExternalGateway {
  // Modo offline troca só a consulta do catálogo; os cadastros seguem no PostgreSQL.
  // É uma escolha do ambiente, não uma troca automática quando a PokéAPI cai.
  return env.useExternalApi
    ? new PokeApiAxiosGateway()
    : new InMemoryPokemonGateway();
}
