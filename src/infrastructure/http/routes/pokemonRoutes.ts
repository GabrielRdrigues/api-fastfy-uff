import { Router } from 'express';
import { makePokemonController } from '@main/factories/makePokemonController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validateRequest';
import {
  createPokemonSchema,
  listPokemonsQuerySchema,
  pokemonIdParamsSchema,
  searchPokemonsQuerySchema,
  updatePokemonLevelSchema,
  updatePokemonSchema,
} from '@infrastructure/http/schemas/pokemonSchemas';

const pokemonRouter = Router();
const pokemonController = makePokemonController();

pokemonRouter.get(
  '/',
  validateRequest({ query: listPokemonsQuerySchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Lista todos os Pokémons'
    #swagger.description = 'Lista paginada com filtros opcionais por tipo e intervalo de nível.'
    #swagger.parameters['type'] = {
      in: 'query',
      name: 'type',
      required: false,
      schema: { type: 'string', example: 'Electric' },
      description: 'Filtra os Pokémons pelo tipo.'
    }
    #swagger.parameters['page'] = { in: 'query', required: false, schema: { type: 'integer', minimum: 1, default: 1 } }
    #swagger.parameters['limit'] = { in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 } }
    #swagger.parameters['minLevel'] = { in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 100 } }
    #swagger.parameters['maxLevel'] = { in: 'query', required: false, schema: { type: 'integer', minimum: 1, maximum: 100 } }
    #swagger.responses[200] = {
      description: 'Lista de Pokémons retornada com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } },
              meta: {
                type: 'object',
                properties: {
                  page: { type: 'integer', example: 1 },
                  limit: { type: 'integer', example: 10 },
                  total: { type: 'integer', example: 25 }
                }
              }
            }
          }
        }
      }
    }
  */
    return pokemonController.list(req, res);
  },
);

pokemonRouter.get(
  '/search',
  validateRequest({ query: searchPokemonsQuerySchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Busca Pokémons por parte do nome'
    #swagger.description = 'Busca no PostgreSQL com ILIKE, ignorando maiúsculas e minúsculas.'
    #swagger.parameters['name'] = {
      in: 'query',
      required: true,
      schema: { type: 'string', minLength: 1, maxLength: 150, example: 'pika' }
    }
    #swagger.responses[200] = {
      description: 'Pokémons encontrados.',
      content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pokemon' } } } }
    }
    #swagger.responses[400] = { description: 'Informe um nome válido para a busca.' }
  */
    return pokemonController.search(req, res);
  },
);

pokemonRouter.get('/count', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Conta todos os Pokémons do catálogo'
    #swagger.responses[200] = {
      description: 'Total de Pokémons cadastrados.',
      content: { 'application/json': { schema: { type: 'object', properties: { count: { type: 'integer', example: 3 } } } } }
    }
  */
  return pokemonController.count(req, res);
});

pokemonRouter.get(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Busca um Pokémon pelo ID'
    #swagger.description = 'Endpoint para consultar um Pokémon específico pelo seu ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'string', example: '25' },
      description: 'ID do Pokémon.'
    }
    #swagger.responses[200] = {
      description: 'Pokémon encontrado com sucesso.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Pokemon' }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
    return pokemonController.getById(req, res);
  },
);

pokemonRouter.post(
  '/',
  validateRequest({ body: createPokemonSchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Cadastra um novo Pokémon'
    #swagger.description = 'Cadastra pelo nome e enriquece os dados por meio do gateway da PokéAPI.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreatePokemonDto' }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Pokémon cadastrado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Pokémon cadastrado com sucesso!' },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
    // #swagger.responses[409] = { description: 'Já existe um Pokémon com este ID.' }
    // #swagger.responses[503] = { description: 'PokéAPI temporariamente indisponível.' }
    return pokemonController.create(req, res);
  },
);

pokemonRouter.put(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema, body: updatePokemonSchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Atualiza um Pokémon'
    #swagger.description = 'Endpoint para atualizar os dados de um Pokémon cadastrado.'
    #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'string', example: '25' },
      description: 'ID do Pokémon.'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/UpdatePokemonDto' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Pokémon atualizado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Pokémon atualizado com sucesso!' },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
    #swagger.responses[409] = { description: 'O treinador de destino já possui seis Pokémons.' }
  */
    return pokemonController.update(req, res);
  },
);

pokemonRouter.patch(
  '/:id/level',
  validateRequest({
    params: pokemonIdParamsSchema,
    body: updatePokemonLevelSchema,
  }),
  (req, res) => {
    /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Atualiza o nível de um Pokémon'
    #swagger.parameters['id'] = { in: 'path', required: true, schema: { type: 'string', example: '25' } }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['level'],
            properties: { level: { type: 'integer', minimum: 1, maximum: 100, example: 20 } }
          }
        }
      }
    }
    #swagger.responses[204] = { description: 'Nível atualizado. A resposta não possui conteúdo.' }
    #swagger.responses[400] = { description: 'O nível deve ser um número inteiro entre 1 e 100.' }
    #swagger.responses[404] = { description: 'Pokémon não encontrado.' }
  */
    return pokemonController.updateLevel(req, res);
  },
);

pokemonRouter.delete(
  '/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Remove um Pokémon'
    #swagger.description = 'Endpoint para remover um Pokémon do catálogo.'
    #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'string', example: '25' },
      description: 'ID do Pokémon.'
    }
    #swagger.responses[204] = {
      description: 'Pokémon removido com sucesso. A resposta não possui conteúdo.'
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
    return pokemonController.delete(req, res);
  },
);

export default pokemonRouter;
