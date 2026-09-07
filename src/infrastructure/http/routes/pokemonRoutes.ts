import { Router, Request, Response } from 'express';
import { Pokemon } from '../../../domain/entities/Pokemon';
import { InMemoryPokemonRepository } from '../../../infrastructure/database/in-memory/InMemoryPokemonRepository';

const PokemonRouter = Router();
const pokemonRepository = new InMemoryPokemonRepository();

// Lista todos os pokemons cadastrados e aplica filtros se houver
PokemonRouter.get('/', (req: Request, res: Response) => {
  const { type } = req.query;

  if (type) {
    const filteredPokemons = pokemonRepository
      .findAll()
      .filter((p: Pokemon) => p.type.toLowerCase() === String(type).toLowerCase());

    return res.status(200).json(filteredPokemons);
  }

  return res.status(200).json(pokemonRepository.findAll());
});

// Busca um pokémon pelo ID (Status 200 OK ou 404 Not Found)
PokemonRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params; // Extrai o parâmetro da rota

  const pokemon = pokemonRepository.findById(String(id));

  if (!pokemon) {
    return res.status(404).json({ error: 'Pokémon não encontrado no catálogo.' });
  }

  return res.status(200).json(pokemon);
});

// Cadastra um novo pokémon (Status 201 Created ou 400 Bad Request)
PokemonRouter.post('/', (req: Request, res: Response) => {
  const { id, name, type, hp } = req.body;

  if (!id || !name || !type || !hp) {
    return res.status(400).json({
      error: 'Campos obrigatórios ausentes: id, name, type e hp são necessários.'
    });
  }

  const pokemonExists = pokemonRepository.findById(id);
  if (pokemonExists) {
    return res.status(400).json({ error: 'Pokémon com este ID já existe.' });
  }

  const newPokemon = pokemonRepository.create({
    id,
    name,
    type,
    hp: Number(hp),
  });

  return res.status(201).json({
    message: 'Pokémon cadastrado com sucesso!',
    data: newPokemon,
  });
});

PokemonRouter.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, hp } = req.body;

  const updatedPokemon = pokemonRepository.update(String(id), { name, type, hp });

  if (!updatedPokemon) {
    return res.status(404).json({ error: 'Pokémon não encontrado no catálogo.' });
  }

  return res.status(200).json({
    message: 'Pokémon atualizado com sucesso!',
    data: updatedPokemon,
  });
});

PokemonRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedPokemon = pokemonRepository.delete(String(id));

  if (!deletedPokemon) {
    return res.status(404).json({ error: 'Pokémon não encontrado no catálogo.' });
  }

  return res.status(200).json({
    message: 'Pokémon removido com sucesso!',
    data: deletedPokemon,
  });
});

export default PokemonRouter; 


