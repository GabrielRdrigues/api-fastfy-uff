import { Router } from 'express';
import { makePokedexController } from '@main/factories/makePokedexController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validateRequest';
import { searchPokedexQuerySchema } from '@infrastructure/http/schemas/pokedexSchemas';

const pokedexRouter = Router();
const pokedexController = makePokedexController();

pokedexRouter.get(
  '/search',
  validateRequest({ query: searchPokedexQuerySchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokédex']
      #swagger.summary = 'Consulta um Pokémon diretamente na PokéAPI'
      #swagger.parameters['name'] = { in: 'query', required: true, schema: { type: 'string', example: 'pikachu' } }
      #swagger.responses[200] = { description: 'Dados oficiais formatados. Consulta não cadastra Pokémon.', content: { 'application/json': { schema: { $ref: '#/components/schemas/PokeApiPokemon' } } } }
      #swagger.responses[404] = { description: 'Pokémon não encontrado na PokéAPI.' }
      #swagger.responses[503] = { description: 'PokéAPI temporariamente indisponível.' }
    */
    return pokedexController.search(req, res);
  },
);

export default pokedexRouter;
