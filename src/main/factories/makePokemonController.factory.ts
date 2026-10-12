import { TrainPokemon } from '@application/use-cases/TrainPokemon';
import { CreatePokemon } from '@application/use-cases/CreatePokemon';
import { DeletePokemon } from '@application/use-cases/DeletePokemon';
import { GetPokemonById } from '@application/use-cases/GetPokemonById';
import { ListPokemons } from '@application/use-cases/ListPokemons';
import { UpdatePokemon } from '@application/use-cases/UpdatePokemon';
import { UpdatePokemonLevel } from '@application/use-cases/UpdatePokemonLevel';
import { SearchPokemons } from '@application/use-cases/SearchPokemons';
import { CountPokemons } from '@application/use-cases/CountPokemons';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/PrismaPokemonRepository';
import { PokemonController } from '@infrastructure/http/controllers/PokemonController';
import { makePokemonExternalGateway } from '@main/factories/makePokemonExternalGateway.factory';

export function makePokemonController(): PokemonController {
  // Monta o rolê: repositório cuida do banco, gateway busca os dados externos.
  // Entregar essas dependências prontas é a tal injeção de dependência.
  const pokemonRepository = new PrismaPokemonRepository();
  const pokemonExternalGateway = makePokemonExternalGateway();

  return new PokemonController(
    new CreatePokemon(pokemonRepository, pokemonExternalGateway),
    new ListPokemons(pokemonRepository),
    new GetPokemonById(pokemonRepository),
    new UpdatePokemon(pokemonRepository),
    new DeletePokemon(pokemonRepository),
    new UpdatePokemonLevel(pokemonRepository),
    new SearchPokemons(pokemonRepository),
    new CountPokemons(pokemonRepository),
    new TrainPokemon(pokemonRepository),
  );
}
