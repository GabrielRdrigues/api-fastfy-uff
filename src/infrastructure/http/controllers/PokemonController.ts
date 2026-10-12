import { TrainPokemon } from '@application/use-cases/TrainPokemon';
import { Request, Response } from 'express';
import {
  CreatePokemonDTO,
  PokemonListFilters,
  UpdatePokemonDTO,
} from '@application/dtos/pokemon';
import { CountPokemons } from '@application/use-cases/CountPokemons';
import { CreatePokemon } from '@application/use-cases/CreatePokemon';
import { DeletePokemon } from '@application/use-cases/DeletePokemon';
import { GetPokemonById } from '@application/use-cases/GetPokemonById';
import { ListPokemons } from '@application/use-cases/ListPokemons';
import { SearchPokemons } from '@application/use-cases/SearchPokemons';
import { UpdatePokemon } from '@application/use-cases/UpdatePokemon';
import { UpdatePokemonLevel } from '@application/use-cases/UpdatePokemonLevel';

// Faz a ponte HTTP: recebe dados validados, chama o caso de uso e responde em JSON.
export class PokemonController {
  constructor(
    private readonly createPokemon: CreatePokemon,
    private readonly listPokemons: ListPokemons,
    private readonly getPokemonById: GetPokemonById,
    private readonly updatePokemon: UpdatePokemon,
    private readonly deletePokemon: DeletePokemon,
    private readonly updatePokemonLevel: UpdatePokemonLevel,
    private readonly searchPokemons: SearchPokemons,
    private readonly countPokemons: CountPokemons,
    private readonly trainPokemon: TrainPokemon,
  ) {}

  async list(_req: Request, res: Response): Promise<Response> {
    const filters = this.validated<PokemonListFilters>(res, 'query');
    return res.status(200).json(await this.listPokemons.execute(filters));
  }

  async getById(_req: Request, res: Response): Promise<Response> {
    const { id } = this.validated<{ id: string }>(res, 'params');
    const pokemon = await this.getPokemonById.execute(id);
    return res.status(200).json(pokemon);
  }

  async create(_req: Request, res: Response): Promise<Response> {
    const body = this.validated<CreatePokemonDTO>(res, 'body');
    const pokemon = await this.createPokemon.execute(body);

    return res.status(201).json({
      message: 'Pokémon cadastrado com sucesso!',
      data: pokemon,
    });
  }

  async update(_req: Request, res: Response): Promise<Response> {
    const data = this.validated<UpdatePokemonDTO>(res, 'body');
    const { id } = this.validated<{ id: string }>(res, 'params');
    const pokemon = await this.updatePokemon.execute(id, data);

    return res.status(200).json({
      message: 'Pokémon atualizado com sucesso!',
      data: pokemon,
    });
  }

  async delete(_req: Request, res: Response): Promise<Response> {
    const { id } = this.validated<{ id: string }>(res, 'params');
    await this.deletePokemon.execute(id);
    return res.status(204).send();
  }

  async train(_req: Request, res: Response): Promise<Response> {
    const { id } = this.validated<{ id: string }>(res, 'params');
    return res.status(200).json(await this.trainPokemon.execute(id));
  }

  async updateLevel(_req: Request, res: Response): Promise<Response> {
    const { id } = this.validated<{ id: string }>(res, 'params');
    const { level } = this.validated<{ level: number }>(res, 'body');
    await this.updatePokemonLevel.execute(id, level);
    return res.status(204).send();
  }

  async search(_req: Request, res: Response): Promise<Response> {
    const { name } = this.validated<{ name: string }>(res, 'query');
    const pokemons = await this.searchPokemons.execute(name);
    return res.status(200).json(pokemons);
  }

  async count(_req: Request, res: Response): Promise<Response> {
    const count = await this.countPokemons.execute();
    return res.status(200).json({ count });
  }

  private validated<T>(res: Response, target: string): T {
    // O "as T" só informa o tipo ao TypeScript; quem validou de verdade foi o Zod.
    return res.locals.validated[target] as T;
  }
}
