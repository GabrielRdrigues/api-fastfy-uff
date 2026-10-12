import { CreateTrainer } from '@application/use-cases/CreateTrainer';
import { CapturePokemon } from '@application/use-cases/CapturePokemon';
import { DeleteTrainer } from '@application/use-cases/DeleteTrainer';
import { GetTrainerById } from '@application/use-cases/GetTrainerById';
import { GetTrainerTeam } from '@application/use-cases/GetTrainerTeam';
import { ListTrainers } from '@application/use-cases/ListTrainers';
import { UpdateTrainer } from '@application/use-cases/UpdateTrainer';
import { PrismaPokemonRepository } from '@infrastructure/database/prisma/PrismaPokemonRepository';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/PrismaTrainerRepository';
import { TrainerController } from '@infrastructure/http/controllers/TrainerController';
import { makePokemonExternalGateway } from '@main/factories/makePokemonExternalGateway.factory';

export function makeTrainerController(): TrainerController {
  // Captura precisa dos dois repositórios: confere o treinador e salva o Pokémon.
  const trainerRepository = new PrismaTrainerRepository();
  const pokemonRepository = new PrismaPokemonRepository();
  const pokeApiGateway = makePokemonExternalGateway();

  return new TrainerController(
    new CreateTrainer(trainerRepository),
    new ListTrainers(trainerRepository),
    new GetTrainerById(trainerRepository),
    new UpdateTrainer(trainerRepository),
    new CapturePokemon(trainerRepository, pokemonRepository, pokeApiGateway),
    new GetTrainerTeam(trainerRepository, pokemonRepository),
    new DeleteTrainer(trainerRepository),
  );
}
