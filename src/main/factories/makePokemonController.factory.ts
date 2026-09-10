import { CreatePokemon } from '../../application/use-cases/CreatePokemon';
import { DeletePokemon } from '../../application/use-cases/DeletePokemon';
import { GetPokemonById } from '../../application/use-cases/GetPokemonById';
import { ListPokemons } from '../../application/use-cases/ListPokemons';
import { UpdatePokemon } from '../../application/use-cases/UpdatePokemon';
import { InMemoryPokemonRepository } from '../../infrastructure/database/in-memory/InMemoryPokemonRepository';
import { PokemonController } from '../../infrastructure/http/controllers/PokemonController';

export function makePokemonController(): PokemonController {
  const pokemonRepository = new InMemoryPokemonRepository();

  return new PokemonController(
    new CreatePokemon(pokemonRepository),
    new ListPokemons(pokemonRepository),
    new GetPokemonById(pokemonRepository),
    new UpdatePokemon(pokemonRepository),
    new DeletePokemon(pokemonRepository),
  );
}
