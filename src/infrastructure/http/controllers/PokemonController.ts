import { Request, Response } from 'express';
import { CreatePokemon } from '../../../application/use-cases/CreatePokemon';
import { DeletePokemon } from '../../../application/use-cases/DeletePokemon';
import { GetPokemonById } from '../../../application/use-cases/GetPokemonById';
import { ListPokemons } from '../../../application/use-cases/ListPokemons';
import { UpdatePokemon } from '../../../application/use-cases/UpdatePokemon';

export class PokemonController {
  constructor(
    private readonly createPokemon: CreatePokemon,
    private readonly listPokemons: ListPokemons,
    private readonly getPokemonById: GetPokemonById,
    private readonly updatePokemon: UpdatePokemon,
    private readonly deletePokemon: DeletePokemon,
  ) {}

  list(req: Request, res: Response): Response {
    const type = req.query.type ? String(req.query.type) : undefined;
    const pokemons = this.listPokemons.execute(type);

    return res.status(200).json(pokemons);
  }

  getById(req: Request, res: Response): Response {
    const pokemon = this.getPokemonById.execute(String(req.params.id));

    if (!pokemon) {
      return res.status(404).json({
        error: 'Pokémon não encontrado no catálogo.',
      });
    }

    return res.status(200).json(pokemon);
  }

  create(req: Request, res: Response): Response {
    const { id, name, type, hp } = req.body;

    if (!id || !name || !type || hp === undefined || hp === null) {
      return res.status(400).json({
        error:
          'Campos obrigatórios ausentes: id, name, type e hp são necessários.',
      });
    }

    try {
      const pokemon = this.createPokemon.execute({
        id: String(id),
        name,
        type,
        hp: Number(hp),
      });

      return res.status(201).json({
        message: 'Pokémon cadastrado com sucesso!',
        data: pokemon,
      });
    } catch (error) {
      return res.status(400).json({
        error:
          error instanceof Error ? error.message : 'Erro ao cadastrar Pokémon.',
      });
    }
  }

  update(req: Request, res: Response): Response {
    const { name, type, hp } = req.body;
    const pokemon = this.updatePokemon.execute(String(req.params.id), {
      name,
      type,
      hp: hp === undefined ? undefined : Number(hp),
    });

    if (!pokemon) {
      return res.status(404).json({
        error: 'Pokémon não encontrado no catálogo.',
      });
    }

    return res.status(200).json({
      message: 'Pokémon atualizado com sucesso!',
      data: pokemon,
    });
  }

  delete(req: Request, res: Response): Response {
    const pokemon = this.deletePokemon.execute(String(req.params.id));

    if (!pokemon) {
      return res.status(404).json({
        error: 'Pokémon não encontrado no catálogo.',
      });
    }

    return res.status(204).send();
  }
}
