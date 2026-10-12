import { SearchPokedex } from '@application/use-cases/SearchPokedex';
import { PokedexController } from '@infrastructure/http/controllers/PokedexController';
import { makePokemonExternalGateway } from '@main/factories/makePokemonExternalGateway.factory';

export function makePokedexController(): PokedexController {
  return new PokedexController(new SearchPokedex(makePokemonExternalGateway()));
}
